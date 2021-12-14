import { tc } from '..'

/**
 * Utils for anything related to strings.
 *
 * @category Utility
 */
export class StringUtils {
  /** @hidden */
  constructor() {}

  /**
   * Transforms any string to a per word capitalized string but with the first char in lowercase.
   */
  static camelCase(string: string): string {
    return string
      .split(/[^a-zA-Z]/)
      .map((v: string, k: number) => (k > 0 ? this.capitalize(v, true) : v.toLowerCase()))
      .join('')
  }

  /**
   * Capitalizes the first letter in a string, if lowercase is set to true the other characters will be lowercased.
   */
  static capitalize(string: string, lowercase: boolean = false): string {
    return string.charAt(0).toUpperCase() + (lowercase ? string.slice(1).toLowerCase() : string.slice(1))
  }

  /**
   * Transforms any string to a word divided string by dashes.
   */
  static kebabCase(string: string): string {
    return string.split(/[^a-zA-Z]/).join('-')
  }

  /**
   * Transforms any string to a word divided string by underscores.
   */
  static snakeCase(string: string): string {
    return string.split(/[^a-zA-Z]/).join('_')
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

  /**
   * Checks if a string is a stringified JSON.
   */
  static isJSON(string: string): boolean {
    return !(tc(() => JSON.parse(string), false) instanceof Error)
  }

  /**
   * Checks if a string is not a stringified JSON.
   */
  static isNotJSON(string: string): boolean {
    return tc(() => JSON.parse(string), false) instanceof Error
  }
}
