/**
 * Utils for anything related to React.
 *
 * @category Utility
 */
export class ReactUtils {
  /** @hidden */
  constructor() {}

  /**
   * Joins an array of classNames to a well formatted string without values that are not strings.
   */
  static joinClassNames(...classNames: any[]): string {
    return classNames
      .filter((v: string) => typeof v === 'string' && v.length > 0)
      .join(' ')
      .replace(/ {2,}/gm, ' ')
  }
}
