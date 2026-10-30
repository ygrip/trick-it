import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { countWords, validateGuide, validateToolArticle } from '../src/lib/content/schema.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

/** @param {string} directory */
async function jsonFiles(directory) {
  const names = await readdir(directory).catch(() => []);
  return names.filter((name) => name.endsWith('.json')).sort();
}

/**
 * Validate host editorial content. With `requireAll`, every catalog tool needs an article,
 * which is what keeps tool pages from shipping as thin, UI-only shells.
 */
export async function validateContent({ root = projectRoot, requireAll = false, only = [] } = {}) {
  const tools = JSON.parse(await readFile(join(root, 'src/lib/registry/generated.json'), 'utf8'));
  const toolIds = tools.map((/** @type {{id:string}} */ tool) => tool.id);
  /** @type {string[]} */
  const problems = [];
  const report = [];

  const articleDirectory = join(root, 'content/tools');
  const articleNames = await jsonFiles(articleDirectory);
  for (const name of articleNames) {
    const id = name.slice(0, -'.json'.length);
    if (only.length && !only.includes(id)) continue;
    if (!toolIds.includes(id)) {
      problems.push(`content/tools/${name}: no catalog tool named ${id}`);
      continue;
    }
    const article = JSON.parse(await readFile(join(articleDirectory, name), 'utf8'));
    validateToolArticle(article, id).forEach((error) => problems.push(`content/tools/${name}: ${error}`));
    report.push(`${id}: ${countWords(article)} words`);
  }
  if (requireAll) {
    for (const id of toolIds) {
      if (!articleNames.includes(`${id}.json`)) problems.push(`content/tools/${id}.json is missing`);
    }
  }

  const guideDirectory = join(root, 'content/guides');
  for (const name of await jsonFiles(guideDirectory)) {
    const slug = name.slice(0, -'.json'.length);
    if (only.length && !only.includes(slug)) continue;
    const guide = JSON.parse(await readFile(join(guideDirectory, name), 'utf8'));
    validateGuide(guide, slug, toolIds).forEach((error) => problems.push(`content/guides/${name}: ${error}`));
    report.push(`guide ${slug}: ${countWords(guide)} words`);
  }
  return { problems, report };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const requireAll = args.includes('--require-all');
  const only = args.filter((arg) => !arg.startsWith('--'));
  const { problems, report } = await validateContent({ requireAll, only });
  report.forEach((line) => console.log(`  ${line}`));
  if (problems.length) {
    problems.forEach((problem) => console.error(`✗ ${problem}`));
    process.exit(1);
  }
  console.log(`✓ Editorial content valid (${report.length} entries).`);
}
