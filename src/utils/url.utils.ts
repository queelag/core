/**
 * @category Utility
 */
export class URLUtils {
  /** @hidden */
  constructor() {}

  static concat(...chunks: string[]): string {
    return chunks
      .join('/')
      .replace(/\/{2,}/g, '/')
      .replace(/\/$/, '')
      .replace(':/', '://')
  }

  static removeSearchParams(url: string): string {
    return url.replace(/\?.+/, '').trim()
  }
}
