import test from 'node:test';
import assert from 'node:assert/strict';
import { countWords, inlineTokens, validateGuide, validateToolArticle } from '../src/lib/content/schema.js';
import { validateContent } from '../scripts/validate-content.mjs';

test('inline tokens allow only code, site-local and https links', () => {
  assert.deepEqual(inlineTokens('Use `jq` or [JSON Tools](/json-tools/).').map((token) => token.kind), ['text', 'code', 'text', 'link', 'text']);
  assert.equal(inlineTokens('[docs](https://example.com)')[0].external, true);
  for (const unsafe of ['[x](javascript:alert(1))', '[x](//evil.example)', '[x](http://plain.example)']) {
    const tokens = inlineTokens(unsafe);
    assert.ok(tokens.every((token) => token.kind === 'text'));
    assert.equal(tokens.map((token) => token.value).join(''), unsafe);
  }
});

test('thin or malformed articles and guides are rejected', () => {
  const thin = { id: 'json-tools', updated: '2026-10-30', about: ['One.', 'Two.'], features: [], reference: { title: 'R', sections: [] }, example: { title: 'E', blocks: [] }, limits: [], faq: [] };
  const errors = validateToolArticle(thin, 'json-tools');
  assert.ok(errors.some((error) => error.includes('features')));
  assert.ok(errors.some((error) => error.includes('words')));
  assert.ok(validateToolArticle({ ...thin, id: 'other' }, 'json-tools').some((error) => error.includes('id must equal')));
  const guide = { slug: 'x', title: 'T', description: 'D', published: '2026-10-30', updated: '2026-10-30', tools: ['missing'], intro: ['Intro.'], sections: [] };
  assert.ok(validateGuide(guide, 'x', ['json-tools']).some((error) => error.includes('unknown tool')));
  assert.equal(countWords({ id: 'ignored-id', text: 'three real words' }), 3);
});

test('committed editorial content is valid', async () => {
  const { problems } = await validateContent();
  assert.deepEqual(problems, []);
});
