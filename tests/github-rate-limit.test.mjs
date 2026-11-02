import test from 'node:test';
import assert from 'node:assert/strict';
import { createGithubClient } from '../scripts/lib/bundles.mjs';

test('GitHub API failures distinguish rate exhaustion from permission errors without response leaks', async () => {
  const path = '/repos/ygrip/private-tool/contents/tool.manifest.json';
  const rateLimited = createGithubClient('private-secret-sentinel', async () => new Response('sensitive-body-sentinel', {
    status: 403,
    headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1800000000', 'retry-after': '30' }
  }));
  await assert.rejects(rateLimited(path), (error) =>
    error.message.includes('GitHub 403') &&
    error.message.includes('rate limit exhausted') &&
    error.message.includes('retry-after=30s') &&
    error.message.includes('reset=') &&
    !/private-secret-sentinel|sensitive-body-sentinel/.test(error.message)
  );
  const forbidden = createGithubClient('private-secret-sentinel', async () => new Response('sensitive-body-sentinel', {
    status: 403,
    headers: { 'x-ratelimit-remaining': '4999' }
  }));
  await assert.rejects(forbidden(path), (error) =>
    error.message.includes('primary rate limit remaining=4999') &&
    !error.message.includes('rate limit exhausted') &&
    !/private-secret-sentinel|sensitive-body-sentinel/.test(error.message)
  );
});


test('transient network failures are retried while HTTP errors are not', async () => {
  const path = '/repos/ygrip/private-tool/contents/tool.manifest.json';
  let calls = 0;
  const flaky = createGithubClient('token', async () => {
    calls += 1;
    if (calls < 3) throw new TypeError('fetch failed');
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  });
  assert.deepEqual(await flaky(path), { ok: true });
  assert.equal(calls, 3);

  let failures = 0;
  const down = createGithubClient('token', async () => { failures += 1; throw new TypeError('fetch failed'); });
  await assert.rejects(down(path), /GitHub request failed/);
  assert.equal(failures, 3);

  let statuses = 0;
  const missing = createGithubClient('token', async () => { statuses += 1; return new Response('', { status: 404 }); });
  await assert.rejects(missing(path), /GitHub 404/);
  assert.equal(statuses, 1);
});
