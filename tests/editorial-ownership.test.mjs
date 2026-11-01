import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { languageCodes } from '../src/lib/languages.js';

const toolIds = [
  'ai-music-maker', 'app-icon-generator', 'background-remover', 'color-mapper',
  'cron-planner', 'csv-tools', 'curl-generator', 'diff-checker', 'encoder-decoder',
  'fake-data-generator', 'fractal-studio', 'gif-maker', 'har-studio', 'hash-generator',
  'hex-tools', 'id-generator', 'image-compression', 'image-converter', 'image-editor',
  'json-tools', 'jwt-tools', 'link-checker', 'list-tools', 'markdown-studio',
  'og-metadata-generator', 'pdf-tools', 'pojo-to-any', 'protobuf-studio',
  'qr-bar-coder', 'regex-mania', 'save-my-wiki', 'seo-checker', 'svg-tools',
  'text-manipulation', 'time-wizard', 'who-track-me'
];
const toolPrefixes = toolIds.map((id) => id.replaceAll('-', '_') + '_');

test('tool editorial sources belong to the tool repositories, not the host', async () => {
  await assert.rejects(readdir(new URL('../docs/article-drafts/', import.meta.url)), { code: 'ENOENT' });
});

test('platform locale catalogs do not regain known tool-owned message namespaces', async () => {
  for (const locale of languageCodes) {
    const messages = JSON.parse(await readFile(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8'));
    assert.ok(!Object.hasOwn(messages, 'json_intro'), `${locale}: legacy JSON tool introduction belongs to its tool repository`);
    const toolSpecific = Object.keys(messages).filter((key) => toolPrefixes.some((prefix) => key.startsWith(prefix)));
    assert.deepEqual(toolSpecific, [], `${locale}: tool strings must be published in tool-owned locale packs`);
  }
});
