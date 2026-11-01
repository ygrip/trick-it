/** Keep identity/capabilities intact while sending only the selected copy.
 * @param {import('./types').ToolManifest} tool
 * @param {string} locale
 * @returns {import('./types').ToolManifest}
 */
export function catalogToolForLocale(tool, locale) {
  const { translations, ...base } = tool;
  const translation = translations?.[/** @type {import('./types').ToolLocale} */ (locale)];
  if (!translation) return { ...base, translations: {} };
  return { ...base, translations: { [locale]: translation } };
}

/** Omit full articles from catalog cards; articles are rendered on tool pages.
 * @param {import('./types').ToolManifest} tool
 * @param {string} locale
 */
export function catalogToolSummaryForLocale(tool, locale) {
  const projected = catalogToolForLocale(tool, locale);
  const { article, translations, ...summary } = projected;
  const localizedSummary = Object.fromEntries(Object.entries(translations).map(([language, translation]) => {
    const { article: translatedArticle, ...metadata } = translation;
    return [language, metadata];
  }));
  return { ...summary, translations: localizedSummary };
}
