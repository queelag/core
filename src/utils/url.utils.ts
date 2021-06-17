export class URLUtils {
  static concat(...chunks: string[]): string {
    return chunks
      .join('/')
      .replace(/\/{2,}/g, '/')
      .replace(/\/$/, '')
  }

  static removeSearchParams(url: string): string {
    return url.replace(/\?.+/, '').trim()
  }
}
