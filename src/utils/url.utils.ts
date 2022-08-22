/**
 * Joins a set of URL chunks without making syntax errors.
 */
export function concatURL(...chunks: string[]): string {
  return chunks
    .join('/')
    .replace(/\/{2,}/g, '/')
    .replace(':/', '://')
}

/**
 * Joins a set of search params and safely appends them to the url.
 */
export function appendSearchParamsToURL(url: string, parameters: string): string {
  return [url, parameters].join(url.includes('?') ? '&' : '?').replace(/\?$/, '')
}

/**
 * Removes every search param in a URL.
 */
export function removeSearchParamsFromURL(url: string): string {
  return url.replace(/\?.+/, '').trim()
}
