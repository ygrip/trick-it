// Usage: node scripts/article-kit/install.mjs ../trick-it-tools/<tool>
// Adds the tool-owned article pipeline to a tool repository. Idempotent.
import { copyFile, mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const kit = fileURLToPath(new URL('.', import.meta.url));
const target = resolve(process.argv[2] ?? '');
const exists = async path => access(path).then(() => true, () => false);
if (!(await exists(join(target, 'tool.manifest.json')))) throw new Error('Not a tool repository: ' + target);

const settings = JSON.parse(await readFile(join(target, 'project.inlang/settings.json'), 'utf8'));
await mkdir(join(target, 'project.article.inlang'), { recursive: true });
await writeFile(join(target, 'project.article.inlang/settings.json'), JSON.stringify({
  $schema: 'https://inlang.com/schema/project-settings',
  baseLocale: 'en',
  locales: ['en', 'id', 'ms', 'fil', 'th', 'vi', 'zh', 'my', 'km', 'lo', 'ja', 'hi'],
  modules: settings.modules,
  'plugin.inlang.messageFormat': { pathPattern: './messages/article/{locale}.json' }
}, null, 2) + '\n');
await mkdir(join(target, 'messages/article'), { recursive: true });
await copyFile(join(kit, 'apply-article.mjs'), join(target, 'scripts/apply-article.mjs'));
await copyFile(join(kit, 'article.test.mjs'), join(target, 'scripts/article.test.mjs'));

const packagePath = join(target, 'package.json');
const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
pkg.scripts['i18n:article'] = 'paraglide-js compile --project ./project.article.inlang --outdir ./src/paraglide-article';
if (!pkg.scripts.build.includes('apply-article')) pkg.scripts.build = `${pkg.scripts.build} && npm run i18n:article && node scripts/apply-article.mjs`;
if (!pkg.scripts.test.includes('article.test')) pkg.scripts.test = `${pkg.scripts.test} && node --test scripts/article.test.mjs`;
await writeFile(packagePath, JSON.stringify(pkg, null, 2) + '\n');

const ignorePath = join(target, '.gitignore');
const ignore = (await exists(ignorePath)) ? await readFile(ignorePath, 'utf8') : '';
if (!ignore.includes('src/paraglide-article/')) await writeFile(ignorePath, `${ignore.replace(/\n?$/, '\n')}src/paraglide-article/\n`);
console.log('Installed article kit in ' + target);
