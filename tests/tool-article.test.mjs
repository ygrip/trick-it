import test from 'node:test';
import assert from 'node:assert/strict';
import { validateArticle, faqStructuredData, ARTICLE_LIMITS } from '../src/lib/registry/article.js';
import { validateManifest } from '../src/lib/registry/contract.js';

const article = () => ({
  headings: { about: 'About', features: 'Features', limits: 'Limits', faq: 'FAQ' },
  about: ['What the tool does.'],
  features: [{ title: 'Fast', body: 'Runs locally.' }],
  reference: { title: 'Reference', sections: [{ heading: 'Rules', paragraphs: ['A rule.'], items: ['One'] }] },
  example: { title: 'Example', paragraphs: ['Try this.'], code: '{"a":1}' },
  limits: ['Large inputs are slow.'],
  faq: [{ question: 'Is it private?', answer: 'Yes, it runs in the browser.' }]
});

const manifest = (extra = {}) => ({
  schemaVersion: 3, runtimeVersion: 1, appearance: { theme: 'host', protocolVersion: 1 },
  id: 'sample-tool', name: 'Sample', description: 'A sample.', path: '/sample-tool', category: 'developer',
  repository: 'https://github.com/ygrip/sample-tool', version: '0.1.0', status: 'beta', capabilities: ['sample'], icon: 'braces',
  seo: { title: 'Sample', description: 'A sample.', keywords: ['sample'], robots: 'index' },
  guide: { summary: 'Use it.', steps: ['Enter input.'] }, permissions: [], assets: [], translations: {},
  bundle: { format: 'html', file: 'dist/index.html', sha256: 'a'.repeat(64) }, ...extra
});

test('a well-formed tool article validates and mirrors FAQ structured data exactly', () => {
  const parsed = validateArticle(article());
  assert.equal(parsed.faq.length, 1);
  assert.deepEqual(faqStructuredData(parsed).mainEntity[0].acceptedAnswer.text, 'Yes, it runs in the browser.');
});

test('malformed, oversized or markup-bearing article fields are rejected', () => {
  const missing = article(); delete missing.faq;
  const unknown = { ...article(), html: '<b>x</b>' };
  const long = article(); long.about = ['x'.repeat(ARTICLE_LIMITS.paragraph + 1)];
  const control = article(); control.about = ['bad\u0000text'];
  const bloated = article(); bloated.reference.sections = Array.from({ length: ARTICLE_LIMITS.sections }, () => ({ heading: 'h', paragraphs: Array.from({ length: ARTICLE_LIMITS.paragraphsPerSection }, () => 'y'.repeat(1000)) }));
  for (const bad of [missing, unknown, long, control, bloated]) assert.throws(() => validateArticle(bad), /article/);
});

test('manifests carry a canonical and per-locale article through the public contract', () => {
  const localized = { ...article(), about: ['Apa fungsi alat ini.'] };
  const result = validateManifest(manifest({ article: article(), locales: ['en', 'id'], translations: { id: { name: 'Contoh', description: 'Contoh.', article: localized } }, localePacks: { id: { file: 'dist/locales/id.json', sha256: 'b'.repeat(64), bytes: 10 } } }));
  assert.equal(result.article.about[0], 'What the tool does.');
  assert.equal(result.translations.id.article.about[0], 'Apa fungsi alat ini.');
  assert.equal(validateManifest(manifest()).article, undefined);
  assert.throws(() => validateManifest(manifest({ article: { about: ['x'] } })), /article/);
});
