import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { assembleArticle, requiredKeys } from './apply-article.mjs';

const root = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const settings = await read('project.article.inlang/settings.json');
const english = await read('messages/article/en.json');
const manifest = await read('tool.manifest.json');
const keys = Object.keys(english);
const assemble = catalog => assembleArticle(key => catalog[key] ?? english[key], keys);
const numbersIn = text => new Set((text.match(/[0-9]+(?:[.,][0-9]+)*/g) ?? []).map(number => number.replace(/[.,]/g, '')));

test('English article has the structure and size the host accepts', () => {
  const article = assemble(english);
  assert.ok(article.about.length >= 2 && article.about.length <= 6);
  assert.ok(article.features.length >= 4 && article.features.length <= 12);
  assert.ok(article.reference.sections.length >= 2 && article.reference.sections.length <= 8);
  assert.ok(article.limits.length >= 2 && article.limits.length <= 8);
  assert.ok(article.faq.length >= 4 && article.faq.length <= 12);
  for (const section of article.reference.sections) assert.ok(section.paragraphs.length >= 1 && section.paragraphs.length <= 6);
  assert.ok(JSON.stringify(article).length < 28000);
  assert.deepEqual(manifest.article, article, 'run `npm run build` to refresh tool.manifest.json');
});

test('article is published and translated in every Paraglide locale', async () => {
  assert.equal(settings.baseLocale, 'en');
  const expected = settings.locales.filter(locale => locale !== 'en');
  assert.equal(settings.locales.length, 12);
  for (const locale of expected) {
    const catalog = await read(`messages/article/${locale}.json`);
    for (const key of requiredKeys(english)) {
      assert.ok(typeof catalog[key] === 'string' && catalog[key].trim(), `${locale}.${key} is missing`);
      assert.notEqual(catalog[key], english[key], `${locale}.${key} is still English`);
    }
    assert.deepEqual(manifest.translations[locale]?.article, assemble(catalog), `${locale}: run \`npm run build\``);
    const englishText = Object.values(english).join('\n');
    const localizedText = Object.values(catalog).join('\n');
    for (const key of requiredKeys(english)) {
      for (const number of numbersIn(english[key])) assert.ok(numbersIn(catalog[key]).has(number), `${locale}.${key}: keep number ${number}`);
    }
    assert.ok(localizedText.length > englishText.length * 0.2, `${locale}: translation is suspiciously short`);
  }
});

test('article messages stay out of the interface catalogs and locale packs', async () => {
  const catalog = await read('messages/en.json');
  assert.deepEqual(Object.keys(catalog).filter(key => /^(heading[A-Z]|about\d|faq\d|referenceTitle|exampleTitle)/.test(key)), []);
  for (const pack of Object.values(manifest.localePacks ?? {})) {
    const bytes = await readFile(new URL(pack.file, root), 'utf8');
    assert.ok(!bytes.includes('headingAbout'), 'article copy must not ship in locale packs');
  }
});
