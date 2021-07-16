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
   * Removes every search param in a URL.
   */
  static removeSearchParams(url: string): string {
    return url.replace(/\?.+/, '').trim()
  }
}
