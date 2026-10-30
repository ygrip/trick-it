/**
 * Tool-owned article: reader-facing documentation that ships with each tool release.
 *
 * The tool repository writes the copy with Paraglide JS (`article*` message keys),
 * and its build assembles the structure below into `manifest.article` (English) and
 * `manifest.translations[locale].article`. The host only validates and renders it as
 * plain text. No markup, links or scripts are accepted.
 */

export const ARTICLE_LIMITS = Object.freeze({
  about: 6,
  features: 12,
  sections: 8,
  paragraphsPerSection: 6,
  itemsPerSection: 12,
  examples: 6,
  limits: 8,
  faq: 12,
  paragraph: 1200,
  title: 160,
  code: 4000,
  totalCharacters: 28000
});

/** @param {any} value @param {number} maximum @param {string} label */
function text(value, maximum, label) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw new Error(`invalid article ${label}`);
  return value.trim();
}

/** @param {any} value @param {number} minimum @param {number} maximum @param {number} length @param {string} label */
function list(value, minimum, maximum, length, label) {
  if (!Array.isArray(value) || value.length < minimum || value.length > maximum) throw new Error(`invalid article ${label}`);
  return value.map((item) => text(item, length, label));
}

/** @param {any} value @param {string[]} allowed @param {string} label */
function exactKeys(value, allowed, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`invalid article ${label}`);
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new Error(`unsupported article ${label} field`);
  return value;
}

/** Count visible characters so one release cannot bloat the catalog.
 * @param {unknown} value
 * @returns {number}
 */
function characters(value) {
  if (typeof value === 'string') return value.length;
  if (Array.isArray(value)) return value.reduce((total, item) => total + characters(item), 0);
  if (value && typeof value === 'object') return Object.values(value).reduce((/** @type {number} */ total, item) => total + characters(item), 0);
  return 0;
}

/**
 * @param {any} value
 * @returns {import('./types').ToolArticle}
 */
export function validateArticle(value) {
  exactKeys(value, ['headings', 'about', 'features', 'reference', 'example', 'limits', 'faq'], 'article');
  exactKeys(value.headings, ['about', 'features', 'limits', 'faq'], 'headings');
  const features = (() => {
    if (!Array.isArray(value.features) || value.features.length < 1 || value.features.length > ARTICLE_LIMITS.features) throw new Error('invalid article features');
    return value.features.map((/** @type {any} */ feature) => {
      exactKeys(feature, ['title', 'body'], 'feature');
      return { title: text(feature.title, ARTICLE_LIMITS.title, 'feature title'), body: text(feature.body, ARTICLE_LIMITS.paragraph, 'feature body') };
    });
  })();
  exactKeys(value.reference, ['title', 'sections'], 'reference');
  if (!Array.isArray(value.reference.sections) || value.reference.sections.length < 1 || value.reference.sections.length > ARTICLE_LIMITS.sections) throw new Error('invalid article reference sections');
  const sections = value.reference.sections.map((/** @type {any} */ section) => {
    exactKeys(section, ['heading', 'paragraphs', 'items'], 'reference section');
    return {
      heading: text(section.heading, ARTICLE_LIMITS.title, 'section heading'),
      paragraphs: list(section.paragraphs, 1, ARTICLE_LIMITS.paragraphsPerSection, ARTICLE_LIMITS.paragraph, 'section paragraph'),
      ...(section.items === undefined ? {} : { items: list(section.items, 1, ARTICLE_LIMITS.itemsPerSection, ARTICLE_LIMITS.paragraph, 'section item') })
    };
  });
  exactKeys(value.example, ['title', 'paragraphs', 'code'], 'example');
  const article = {
    headings: {
      about: text(value.headings.about, ARTICLE_LIMITS.title, 'about heading'),
      features: text(value.headings.features, ARTICLE_LIMITS.title, 'features heading'),
      limits: text(value.headings.limits, ARTICLE_LIMITS.title, 'limits heading'),
      faq: text(value.headings.faq, ARTICLE_LIMITS.title, 'faq heading')
    },
    about: list(value.about, 1, ARTICLE_LIMITS.about, ARTICLE_LIMITS.paragraph, 'about paragraph'),
    features,
    reference: { title: text(value.reference.title, ARTICLE_LIMITS.title, 'reference title'), sections },
    example: {
      title: text(value.example.title, ARTICLE_LIMITS.title, 'example title'),
      paragraphs: list(value.example.paragraphs, 1, ARTICLE_LIMITS.examples, ARTICLE_LIMITS.paragraph, 'example paragraph'),
      ...(value.example.code === undefined ? {} : { code: text(value.example.code, ARTICLE_LIMITS.code, 'example code') })
    },
    limits: list(value.limits, 1, ARTICLE_LIMITS.limits, ARTICLE_LIMITS.paragraph, 'limitation'),
    faq: (() => {
      if (!Array.isArray(value.faq) || value.faq.length < 1 || value.faq.length > ARTICLE_LIMITS.faq) throw new Error('invalid article faq');
      return value.faq.map((/** @type {any} */ entry) => {
        exactKeys(entry, ['question', 'answer'], 'faq entry');
        return { question: text(entry.question, ARTICLE_LIMITS.title, 'faq question'), answer: text(entry.answer, ARTICLE_LIMITS.paragraph, 'faq answer') };
      });
    })()
  };
  if (characters(article) > ARTICLE_LIMITS.totalCharacters) throw new Error('article exceeds the size limit');
  return article;
}

/** FAQPage structured data must mirror the visible FAQ exactly.
 * @param {import('./types').ToolArticle} article
 */
export function faqStructuredData(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((entry) => ({ '@type': 'Question', name: entry.question, acceptedAnswer: { '@type': 'Answer', text: entry.answer } }))
  };
}
