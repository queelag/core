export class QueryParametersUtils {
  static toString(parameters: object): string {
    return Object.entries(parameters)
      .map((v: [string, string]) => v.join('='))
      .join('&')
  }
}
