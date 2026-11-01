// Creates tool-owned, non-publishing editorial seeds from already localized guides.
// Usage: node scripts/article-kit/seed-locales.mjs ../my-tool
// Do not treat these starter catalogs as final articles or native-reviewed copy.
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const supported = ['en','id','ms','fil','th','vi','zh','my','km','lo','ja','hi'];
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));

export function articleSeeds(manifest, labels) {
  if (JSON.stringify(manifest.locales) !== JSON.stringify(supported)) {
    throw Error('Expected complete 12-language tool-owned locale support');
  }
  if (!manifest.guide?.steps?.length) throw Error('The tool must have a source guide');
  const output = {};
  for (const loc of supported) {
    const t = loc === 'en' ? manifest : manifest.translations?.[loc];
    const g = t?.guide;
    const englishGuide = manifest.guide;
    if (!t || !g || !Array.isArray(g.steps) || g.steps.length !== englishGuide.steps.length) {
      if (loc !== 'en') throw Error(`Missing or inconsistent localized guide: ${loc}`);
    }
    const guide = loc === 'en' ? englishGuide : g;
    const a = labels[loc];
    if (!Array.isArray(a) || a.length !== 6) throw Error('Missing translated section labels: ' + loc);
    const steps = guide.steps;
    const catalog = {
      headingAbout: a[0], headingFeatures: a[1],
      about1: t.description, about2: guide.summary,
      referenceTitle: a[2], reference1Heading: a[3], reference1P1: guide.summary,
      exampleTitle: a[4], exampleP1: steps[0]
    };
    steps.forEach((step, i) => {
      catalog[`feature${i + 1}Title`] = `${a[5]} ${i + 1}`;
      catalog[`feature${i + 1}Body`] = step;
      catalog[`reference1Item${i + 1}`] = step;
    });
    if (Object.values(catalog).some(value => typeof value !== 'string' || !value.trim())) {
      throw Error('Invalid source guide/metadata for locale ' + loc);
    }
    output[loc] = catalog;
  }
  const keys = Object.keys(output.en).sort().join('|');
  for (const loc of supported) if (Object.keys(output[loc]).sort().join('|') !== keys) throw Error('Article seed keys mismatch: ' + loc);
  return output;
}

export function editorialBrief(manifest) {
  const steps = manifest.guide.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
  const capabilities = manifest.capabilities.map(value => '- ' + value).join('\n');
  return `# ${manifest.name}: source-grounded editorial brief

**Draft only, not a published article.** The 12 tool-owned Paraglide starter catalogs reuse existing translated guide/metadata. No fresh editorial translations, native review or independent technical fact checks are implied.

${manifest.description}

${manifest.guide.summary}

## Documented workflow
${steps}

## Declared capabilities
${capabilities}

## Required before publication
Verify every feature, privacy/network assertion and limit against README, source and tests; add a useful technical reference, real worked example, honest limitations and user-facing FAQs in all 12 locales. Complete the host article contract, have languages reviewed, wire the build/release and pin verified tool commits. Do not merge or deploy this seed alone.
`;
}

export async function seedTool(target) {
  const destination = resolve(target);
  const [manifest, settings, labels] = await Promise.all([
    readJson(join(destination, 'tool.manifest.json')),
    readJson(join(destination, 'project.inlang/settings.json')),
    readJson(join(root, 'scripts/article-kit/seed-labels.json'))
  ]);
  const generated = articleSeeds(manifest, labels);
  const outputs = {
    'project.article.inlang/settings.json': JSON.stringify({
      $schema: 'https://inlang.com/schema/project-settings',
      baseLocale: 'en', locales: supported, modules: settings.modules,
      'plugin.inlang.messageFormat': { pathPattern: './messages/article/{locale}.json' }
    }, null, 2) + '\n',
    'docs/editorial/ARTICLE_BRIEF.md': editorialBrief(manifest)
  };
  for (const loc of supported) outputs[`messages/article/${loc}.json`] = JSON.stringify(generated[loc], null, 2) + '\n';
  // Fail without modifying anything if a teammate already authored one of these files.
  for (const filename of Object.keys(outputs)) {
    if (await access(join(destination, filename)).then(() => true, () => false)) {
      throw Error('Refusing to overwrite existing editorial work: ' + filename);
    }
  }
  for (const [filename, contents] of Object.entries(outputs)) {
    const path = join(destination, filename);
    await mkdir(resolve(path, '..'), { recursive: true });
    await writeFile(path, contents, { flag: 'wx' });
  }
  return { tool: manifest.id, locales: supported.length, files: Object.keys(outputs).length, published: false };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  if (!process.argv[2]) throw Error('Usage: node scripts/article-kit/seed-locales.mjs /path/to/tool');
  console.log(JSON.stringify(await seedTool(process.argv[2])));
}
