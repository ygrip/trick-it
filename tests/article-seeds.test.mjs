import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { articleSeeds, editorialBrief } from '../scripts/article-kit/seed-locales.mjs';

const labels = JSON.parse(await readFile(new URL('../scripts/article-kit/seed-labels.json', import.meta.url), 'utf8'));
const locales = Object.keys(labels);
const englishGuide = { summary: 'Work with the input locally.', steps: ['Choose a file.', 'Review the result.'] };
const manifest = {
  id: 'example-tool', name: 'Example Tool', description: 'Convert an example input.',
  capabilities: ['file-import', 'local-conversion'], locales, guide: englishGuide,
  translations: Object.fromEntries(locales.filter(x => x !== 'en').map(locale => [
    locale, { name: 'Localized tool ' + locale, description: 'Localized description ' + locale,
      guide: { summary: 'Localized summary ' + locale, steps: ['Localized input ' + locale, 'Localized result ' + locale] } }
  ]))
};

test('locale seeding retains every tool-owned language with exact key parity', () => {
  const seeded = articleSeeds(manifest, labels);
  assert.deepEqual(Object.keys(seeded), locales);
  const keys = Object.keys(seeded.en).sort();
  for (const locale of locales) {
    assert.deepEqual(Object.keys(seeded[locale]).sort(), keys, locale);
    assert.ok(seeded[locale].exampleP1);
    assert.equal(seeded[locale].feature2Title.endsWith('2'), true);
    if (locale !== 'en') {
      assert.equal(seeded[locale].about1, manifest.translations[locale].description);
      assert.equal(seeded[locale].feature1Body, manifest.translations[locale].guide.steps[0]);
    }
  }
  assert.match(editorialBrief(manifest), /not a published article/i);
});

test('seeding fails if a tool lacks a genuine translated guide', () => {
  const incomplete = structuredClone(manifest);
  delete incomplete.translations.hi.guide;
  assert.throws(() => articleSeeds(incomplete, labels), /Missing or inconsistent localized guide/);
  const mismatched = structuredClone(manifest);
  mismatched.translations.id.guide.steps.pop();
  assert.throws(() => articleSeeds(mismatched, labels), /Missing or inconsistent localized guide/);
});
