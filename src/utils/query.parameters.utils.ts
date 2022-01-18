/**
 * Utils for anything related to query parameters.
 *
 * @category Utility
 */
export class QueryParametersUtils {
  /** @hidden */
  constructor() {}

  /**
   * Converts an object to a chain of query parameters.
   *
   * @template T The object interface.
   */
  static toString<T extends object>(parameters: T): string {
    return Object.entries(parameters)
      .map((v: [string, any]) => v.join('='))
      .join('&')
  }
}
