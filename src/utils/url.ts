/**
 * Joins a set of URL chunks without making syntax errors.
 */
export function concatURL(...chunks: Partial<string>[]): string {
  return chunks
    .filter(Boolean)
    .map((v: string) => v.trim())
    .join('/')
    .replace(/:?\/{2,}/g, (substring: string) => (substring.includes(':') ? substring : '/'))
    .trim()
}

/**
 * Joins a set of search params and safely appends them to the url.
 */
export function appendSearchParamsToURL(url: string, parameters: string): string {
  return [url.trim(), parameters.replace('?', '').trim()]
    .join(url.match(/\?.+=.+/) ? '&' : '?')
    .replace(/\?$/, '')
    .replace(/\?{2,}/, '?')
    .replace(/&{2,}/, '&')
}

/**
 * Removes every search param in a URL.
 */
export function removeSearchParamsFromURL(url: string): string {
  return url.replace(/\?.*/, '').trim()
}
