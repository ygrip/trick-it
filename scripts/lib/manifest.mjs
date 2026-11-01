import { validateManifest } from '../../src/lib/registry/contract.js';

// Keep ordinary manifests at the original limit; only localized articles need
// the separately bounded expanded cap.
export const MAX_COMPACT_MANIFEST_BYTES = 64 * 1024;
export const MAX_ARTICLE_MANIFEST_BYTES = 256 * 1024;

/** Parse the exact same metadata bytes for registry sync and tool-owned tests.
 * @param {Uint8Array} bytes
 */
export function parseManifestBytes(bytes) {
  if (bytes.byteLength > MAX_ARTICLE_MANIFEST_BYTES) throw new Error('manifest exceeds 256 KiB');
  const source = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const manifest = JSON.parse(source);
  const hasArticle = manifest && typeof manifest === 'object' && (
    manifest.article !== undefined ||
    Object.values(manifest.translations ?? {}).some(translation => translation?.article !== undefined)
  );
  if (!hasArticle && bytes.byteLength > MAX_COMPACT_MANIFEST_BYTES) throw new Error('manifest exceeds 64 KiB without an article');
  return validateManifest(manifest);
}
