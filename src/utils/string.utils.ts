/**
 * Utils for anything related to strings.
 *
 * @category Utility
 */
export class StringUtils {
  /** @hidden */
  constructor() {}

  /**
   * Capitalizes the first letter in a string, if lowercase is set to true the other characters will be lowercased.
   */
  static capitalize(value: string, lowercase: boolean = false): string {
    return value.charAt(0).toUpperCase() + (lowercase ? value.slice(1).toLowerCase() : value.slice(1))
  }

  /**
   * Joins a set of strings with an underscore.
   */
  static concat(...strings: string[]): string {
    return strings.join('_')
  }

  /**
   * Transforms any string to a per word capitalized string.
   */
  static startCase(string: string): string {
    return string
      .split(/[^a-zA-Z]/)
      .map((v: string) => this.capitalize(v, true))
      .join(' ')
  }
}
