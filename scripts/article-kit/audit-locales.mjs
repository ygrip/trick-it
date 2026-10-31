#!/usr/bin/env node
// Non-publishing coverage audit for a tool-owned Paraglide article.
// Usage: node scripts/article-kit/audit-locales.mjs ../tool-repo [--json] [--strict]
// Reports what a reviewer must translate without ever modifying manifests.
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const LANGUAGES = ['en','id','ms','fil','th','vi','zh','my','km','lo','ja','hi'];
const cwd = process.argv.slice(2).find(arg => !arg.startsWith('--'));
const options = new Set(process.argv.slice(2).filter(arg => arg.startsWith('--')));
if (!cwd || options.has('--help')) {
  console.log('Usage: node scripts/article-kit/audit-locales.mjs <tool-repository> [--json] [--strict]');
  process.exit(cwd ? 0 : 1);
}
const root = resolve(cwd);
const read = async locale => JSON.parse(await readFile(join(root, 'messages', 'article', locale + '.json'), 'utf8'));
const checked = [];
const english = await read('en');
const englishKeys = Object.keys(english);
const required = englishKeys.filter(key => key !== 'exampleCode');
function errors(catalog) {
  if (catalog === null || typeof catalog !== 'object' || Array.isArray(catalog)) return ['not a JSON object'];
  return Object.entries(catalog).flatMap(([key, value]) => typeof value !== 'string' || !value.trim() ? [key] : []);
}
for (const locale of LANGUAGES) {
  let catalog = {}, fileExists = true;
  try { catalog = await read(locale); }
  catch (error) {
    if (error?.code === 'ENOENT') fileExists = false;
    else throw error;
  }
  const missing = required.filter(key => typeof catalog[key] !== 'string' || !catalog[key].trim());
  const identical = locale === 'en' ? [] : required.filter(key => typeof catalog[key] === 'string' && catalog[key] === english[key]);
  const extra = Object.keys(catalog).filter(key => !englishKeys.includes(key));
  const malformed = errors(catalog);
  checked.push({locale, fileExists, missing, identical, extra, malformed, totalRequired:required.length, complete:locale === 'en' ? malformed.length === 0 : fileExists && missing.length === 0 && malformed.length === 0});
}
const result = {tool:root, englishKeys:englishKeys.length, englishComplete:checked[0].complete, locales:checked};
if (options.has('--json')) console.log(JSON.stringify(result, null, 2));
else {
  console.log(root + ' | English article keys: ' + englishKeys.length);
  for (const x of checked) console.log(x.locale.padEnd(4) + ' required=' + x.totalRequired + ' missing=' + x.missing.length + ' unchanged-English=' + x.identical.length + ' stale-extra=' + x.extra.length + (x.fileExists ? '' : ' FILE ABSENT'));
  console.log('Identical-to-English is a review signal, not automatic proof of bad translation (technical strings can be shared).');
}
if (options.has('--strict') && checked.some(x => !x.complete)) process.exitCode = 1;
