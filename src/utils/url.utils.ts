/**
 * Joins a set of URL chunks without making syntax errors.
 */
export function concatURL(...chunks: Partial<string>[]): string {
  return chunks
    .filter(Boolean)
    .join('/')
    .replace(/:?\/{2,}/g, (substring: string) => (substring.includes(':') ? substring : '/'))
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
