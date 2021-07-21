/**
 * Utils for anything related to URLs.
 *
 * @category Utility
 */
export class URLUtils {
  /** @hidden */
  constructor() {}

  /**
   * Joins a set of URL chunks without making syntax errors.
   */
  static concat(...chunks: string[]): string {
    return chunks
      .join('/')
      .replace(/\/{2,}/g, '/')
      .replace(/\/$/, '')
      .replace(':/', '://')
  }

  /**
   * Joins a set of search params and safely appends them to the url.
   */
  static appendSearchParams(url: string, params: [string, string][]): string {
    return [
      url,
      params
        .filter((v: [string, string]) => v[0].length > 0 && v[1].length > 0)
        .map((v: [string, string]) => v.join('='))
        .join('&')
    ].join(url.includes('?') ? '&' : '?')
  }

  /**
   * Removes every search param in a URL.
   */
  static removeSearchParams(url: string): string {
    return url.replace(/\?.+/, '').trim()
  }
}
