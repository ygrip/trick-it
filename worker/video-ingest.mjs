import { json, readJson } from './seo-audit.mjs';

const MAX_BUNDLE_BYTES = 160 * 1024 * 1024;

async function handleIngestFailure(response) {
  let code;
  try {
    const body = await readJson(response, 16 * 1024);
    code = body?.error;
  } catch {
    return json({ error: 'upstream' }, 502);
  }
  if (code === 'clip_too_large') return json({ error: 'size' }, 413);
  if (response.status === 422) return json({ error: 'source-unavailable' }, 422);
  if (response.status === 429) return json({ error: 'rate-limit' }, 429);
  if (response.status === 400) return json({ error: 'invalid-request' }, 400);
  if (response.status === 503) return json({ error: 'unavailable' }, 503);
  return json({ error: 'upstream' }, 502);
}

/** Call the named, private Worker entrypoint after host verification. */
export async function handleVideoIngest(feature, input, ip, env, signal) {
  if (!env.VIDEO_INGEST || typeof env.VIDEO_INGEST.fetch !== 'function') return json({ error: 'unavailable' }, 503);
  const request = new Request(`https://video-ingest.internal/v1/${feature}`, {
    method: 'POST',
    signal,
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip },
    body: JSON.stringify({ input })
  });
  const response = await env.VIDEO_INGEST.fetch(request);
  if (!response.ok) return handleIngestFailure(response);
  if (feature === 'resolve') {
    if (response.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
      await response.body?.cancel();
      return json({ error: 'upstream' }, 502);
    }
    return new Response(response.body, { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
  }
  const lengthHeader = response.headers.get('content-length');
  const length = Number(lengthHeader);
  if (response.headers.get('content-type')?.split(';')[0].trim() !== 'application/vnd.video-clipper.bundle' || !lengthHeader || !Number.isSafeInteger(length) || length < 1 || length > MAX_BUNDLE_BYTES) {
    await response.body?.cancel();
    return json({ error: 'upstream' }, 502);
  }
  return new Response(response.body, { headers: { 'content-type': 'application/vnd.video-clipper.bundle', 'content-length': String(length), 'cache-control': 'no-store' } });
}
