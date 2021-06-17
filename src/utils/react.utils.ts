export class ReactUtils {
  static joinClassNames(...classNames: any[]): string {
    return classNames
      .filter((v: string) => typeof v === 'string' && v.length > 0)
      .join(' ')
      .replace(/ {2,}/gm, ' ')
  }
}
