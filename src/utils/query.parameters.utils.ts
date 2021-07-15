/**
 * @category Utility
 */
export class QueryParametersUtils {
  /** @hidden */
  constructor() {}

  static toString(parameters: object): string {
    return Object.entries(parameters)
      .map((v: [string, string]) => v.join('='))
      .join('&')
  }
}
