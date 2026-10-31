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

