const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const LANGUAGE = /^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})?$/;

/** Validate the fixed video-ingest contract before consent or network access.
 * @param {string} feature
 * @param {unknown} value
 */
export function validVideoIngestInput(feature, value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const input = /** @type {Record<string, unknown>} */ (value);
  if (typeof input.videoId !== 'string' || !VIDEO_ID.test(input.videoId)) return false;
  if (feature === 'resolve') {
    if (Object.keys(input).some(key => !['videoId', 'language'].includes(key))) return false;
    return input.language === undefined || typeof input.language === 'string' && LANGUAGE.test(input.language);
  }
  if (feature !== 'extract' || Object.keys(input).some(key => !['videoId', 'startMs', 'endMs', 'maxHeight'].includes(key))) return false;
  const { startMs, endMs, maxHeight } = input;
  if (typeof startMs !== 'number' || typeof endMs !== 'number' || !Number.isSafeInteger(startMs) || !Number.isSafeInteger(endMs)) return false;
  if (startMs < 0 || endMs <= startMs || endMs > 4 * 60 * 60 * 1000 || endMs - startMs > 180_000) return false;
  return maxHeight === undefined || [360, 480, 720, 1080].includes(/** @type {number} */ (maxHeight));
}
