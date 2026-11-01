// Tool-owned article: assemble the Paraglide `messages/article/<locale>.json` catalogs
// into `manifest.article` (English) and `manifest.translations[locale].article`.
// Run after the tool's own build. See docs/tool-article-guide.md in the Trick-it host repo.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as messages from '../src/paraglide-article/messages.js';
import { locales } from '../src/paraglide-article/runtime.js';

const root = new URL('../', import.meta.url);
const read = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));

/** Numbered message keys in numeric order, e.g. aboutN: about1, about2, ... */
function numbered(keys, prefix, suffix = '') {
  const pattern = new RegExp(`^${prefix}(\\d+)${suffix}$`);
  return keys
    .map(key => ({ key, match: pattern.exec(key) }))
    .filter(entry => entry.match)
    .sort((left, right) => Number(left.match[1]) - Number(right.match[1]))
    .map(entry => entry.key);
}

export function assembleArticle(text, keys) {
  const index = (key, pattern) => key.match(pattern)[1];
  const sections = numbered(keys, 'reference', 'Heading').map(headingKey => {
    const n = index(headingKey, /^reference(\d+)Heading$/);
    const paragraphs = numbered(keys, `reference${n}P`).map(text);
    const items = numbered(keys, `reference${n}Item`).map(text);
    return { heading: text(headingKey), paragraphs, ...(items.length ? { items } : {}) };
  });
  const features = numbered(keys, 'feature', 'Title').map(titleKey => ({
    title: text(titleKey), body: text(`feature${index(titleKey, /^feature(\d+)Title$/)}Body`)
  }));
  const faq = numbered(keys, 'faq', 'Q').map(questionKey => ({
    question: text(questionKey), answer: text(`faq${index(questionKey, /^faq(\d+)Q$/)}A`)
  }));
  return {
    headings: { about: text('headingAbout'), features: text('headingFeatures'), limits: text('headingLimits'), faq: text('headingFaq') },
    about: numbered(keys, 'about').map(text),
    features,
    reference: { title: text('referenceTitle'), sections },
    example: {
      title: text('exampleTitle'),
      paragraphs: numbered(keys, 'exampleP').map(text),
      ...(keys.includes('exampleCode') ? { code: text('exampleCode') } : {})
    },
    limits: numbered(keys, 'limit').map(text),
    faq
  };
}

/** Keys a locale must define. `exampleCode` is language-neutral and may be omitted outside English. */
export const requiredKeys = english => Object.keys(english).filter(key => key !== 'exampleCode');

export async function buildArticles() {
  const english = await read('messages/article/en.json');
  const keys = Object.keys(english);
  const manifest = await read('tool.manifest.json');
  manifest.translations ??= {};
  const published = [];
  const skipped = [];
  for (const locale of locales) {
    const catalog = await read(`messages/article/${locale}.json`).catch(() => ({}));
    const missing = requiredKeys(english).filter(key => typeof catalog[key] !== 'string' || !catalog[key].trim());
    if (locale !== 'en' && missing.length) { skipped.push(`${locale} (${missing.length} keys missing)`); continue; }
    const text = key => messages[key]({}, { locale: typeof catalog[key] === 'string' ? locale : 'en' });
    const article = assembleArticle(text, keys);
    if (locale === 'en') {
      manifest.article = article;
    } else if (manifest.translations[locale]) {
      manifest.translations[locale] = { ...manifest.translations[locale], article };
    } else {
      skipped.push(`${locale} (no manifest translation entry)`);
      continue;
    }
    published.push(locale);
  }
  await writeFile(new URL('tool.manifest.json', root), `${JSON.stringify(manifest, null, 2)}\n`);
  return { published, skipped };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { published, skipped } = await buildArticles();
  console.log(`Article published in: ${published.join(', ')}`);
  if (skipped.length) console.warn(`Article not published in: ${skipped.join('; ')}`);
}
