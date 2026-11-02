import test from 'node:test';
import assert from 'node:assert/strict';
import { handleService, serviceConfig } from '../worker/services.mjs';
const hash = 'a'.repeat(64);
const policy = { toolId: 'seo-checker', feature: 'audit', version: '0.2.0', sha256: hash, handler: 'pagespeed-seo', binding: 'FEATURE_LIMIT', action: 'svc_audit', rateLimit: { limit: 5, periodSeconds: 60 }, turnstile: true };
const policies = { 'seo-checker/audit': policy };
const env = { TURNSTILE_SECRET: 'test-secret', TURNSTILE_SITE_KEY: 'public-sitekey', TURNSTILE_HOSTNAMES: 'tools.readynaz.com', SERVICE_ATTEMPT_LIMITER: { limit: async () => ({ success: true }) }, FEATURE_LIMIT: { limit: async () => ({ success: true }) } };
const input = { url: 'https://example.com/', strategy: 'mobile', locale: 'id' };
const body = { version: '0.2.0', sha256: hash, input, turnstileToken: 'fresh-token' };
const req = (patch = {}, path = 'seo-checker/audit') => new Request('https://tools.readynaz.com/api/tools/' + path, { method: 'POST', headers: { origin: 'https://tools.readynaz.com', 'content-type': 'application/json', 'cf-connecting-ip': '1.2.3.4' }, body: JSON.stringify({ ...body, ...patch }) });
const result = { lighthouseResult: { finalUrl: input.url, categories: { seo: { score: 1, auditRefs: [{id:'document-title'}] } }, audits: { 'document-title': { score:1, scoreDisplayMode:'binary' } } } };
test('server policy gates the provider and verifies exact hostname/action with a single-use token', async () => {
  let audits=0;let verifications=0;const used=new Set();
  const fetcher=async(url,options)=>{
    if(String(url).includes('siteverify')){verifications++;const params=new URLSearchParams(options.body);assert.equal(params.get('secret'),'test-secret');assert.equal(options.redirect,'manual');const token=params.get('response');const success=!used.has(token);used.add(token);return Response.json({success,hostname:'tools.readynaz.com',action:'svc_audit'});}
    if(String(url).includes('googleapis.com'))audits++;return Response.json(result);
  };
  assert.equal((await handleService(req(),env,policies,fetcher)).status,200);
  assert.equal((await handleService(req(),env,policies,fetcher)).status,403);
  assert.equal(audits,1);assert.equal(verifications,2);
});
test('missing/forged config, unknown features and obsolete releases cannot call the provider', async()=>{
  let calls=0;const fetcher=async()=>{calls++;return Response.json(result);};
  for(const [request,status] of [[req({turnstileToken:''}),403],[req({sha256:'b'.repeat(64)}),409],[req({turnstile:false,rateLimit:999}),400],[req({},'seo-checker/missing'),404]]) assert.equal((await handleService(request,env,policies,fetcher)).status,status);
  assert.equal((await handleService(req(),{...env,TURNSTILE_SECRET:undefined},policies,fetcher)).status,503);
  assert.equal((await handleService(req(),{...env,FEATURE_LIMIT:undefined},policies,fetcher)).status,503);
  assert.equal(calls,0);
});
test('failed, expired, mismatched and unavailable Turnstile responses fail closed',async()=>{
  for(const verification of [{success:false,'error-codes':['timeout-or-duplicate']},{success:true,hostname:'localhost',action:'svc_audit'},{success:true,hostname:'tools.readynaz.com',action:'other-feature'}]){
    let calls=0;const response=await handleService(req(),env,policies,async url=>{assert.ok(String(url).includes('siteverify'));calls++;return Response.json(verification);});assert.equal(response.status,403);assert.equal(calls,1);
  }
  assert.equal((await handleService(req(),env,policies,async()=>{throw Error('secret');})).status,403);
});
test('independent feature limits use server-owned keys and denial stops provider execution',async()=>{
  const second={...policy,feature:'other',binding:'OTHER_LIMIT',turnstile:false,rateLimit:{limit:1,periodSeconds:10}};let keys=[];
  const bindings={...env,FEATURE_LIMIT:{limit:async({key})=>{keys.push(key);return {success:false};}},OTHER_LIMIT:{limit:async({key})=>{keys.push(key);return {success:true};}}};
  const fetcher=async url=>String(url).includes('siteverify')?Response.json({success:true,hostname:'tools.readynaz.com',action:'svc_audit'}):Response.json(result);
  assert.equal((await handleService(req(),bindings,{...policies,'seo-checker/other':second},fetcher)).status,429);
  assert.equal((await handleService(req({},'seo-checker/other'),bindings,{...policies,'seo-checker/other':second},fetcher)).status,200);
  assert.notEqual(keys[0],keys[1]);
});
test('video-ingest validates input and verification before forwarding to the private binding', async () => {
  const videoPolicy = { ...policy, toolId: 'video-clipper', feature: 'extract', handler: 'video-ingest' };
  const videoPolicies = { 'video-clipper/extract': videoPolicy };
  const videoInput = { videoId: 'dQw4w9WgXcQ', startMs: 0, endMs: 3000, maxHeight: 720 };
  let calls = 0;
  const videoEnv = { ...env, VIDEO_INGEST: { fetch: async request => {
    calls += 1;
    assert.equal(new URL(request.url).pathname, '/v1/extract');
    assert.equal(request.headers.get('cf-connecting-ip'), '1.2.3.4');
    assert.deepEqual(await request.json(), { input: videoInput });
    return new Response(new Uint8Array([1, 2]), { headers: { 'content-type': 'application/vnd.video-clipper.bundle', 'content-length': '2' } });
  } } };
  const verify = async () => Response.json({ success: true, hostname: 'tools.readynaz.com', action: 'svc_audit' });
  assert.equal((await handleService(req({ input: { ...videoInput, url: 'https://evil.example' } }, 'video-clipper/extract'), videoEnv, videoPolicies, verify)).status, 400);
  assert.equal((await handleService(req({ input: videoInput, turnstileToken: '' }, 'video-clipper/extract'), videoEnv, videoPolicies, verify)).status, 403);
  assert.equal(calls, 0);
  const response = await handleService(req({ input: videoInput }, 'video-clipper/extract'), videoEnv, videoPolicies, verify);
  assert.equal(response.status, 200);
  assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [1, 2]);
  assert.equal(calls, 1);
});

test('video-ingest maps source and size errors without leaking upstream details', async () => {
  const videoPolicy = { ...policy, toolId: 'video-clipper', feature: 'resolve', handler: 'video-ingest' };
  const videoPolicies = { 'video-clipper/resolve': videoPolicy };
  const verify = async () => Response.json({ success: true, hostname: 'tools.readynaz.com', action: 'svc_audit' });
  for (const [upstreamCode, upstreamStatus, expectedStatus, expectedCode] of [['source_unavailable', 422, 422, 'source-unavailable'], ['clip_too_large', 422, 413, 'size'], ['source_blocked', 503, 503, 'source-blocked']]) {
    const videoEnv = { ...env, VIDEO_INGEST: { fetch: async () => Response.json({ error: upstreamCode, secret: 'private' }, { status: upstreamStatus }) } };
    const response = await handleService(req({ input: { videoId: 'dQw4w9WgXcQ' } }, 'video-clipper/resolve'), videoEnv, videoPolicies, verify);
    assert.equal(response.status, expectedStatus);
    assert.deepEqual(await response.json(), { error: expectedCode });
  }
});

test('public config exposes no secrets and binds the currently deployed release',async()=>{
  const r=serviceConfig(new Request(`https://tools.readynaz.com/api/tools/seo-checker/audit/config?version=0.2.0&sha256=${hash}`),env,policies);
  assert.equal(r.status,200);const data=await r.json();assert.equal(data.sitekey,'public-sitekey');assert.equal(data.action,'svc_audit');assert.ok(!JSON.stringify(data).includes('test-secret'));
});
