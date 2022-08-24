/**
 * Converts an object to a chain of query parameters.
 *
 * @template T The object interface.
 */
export function convertQueryParametersObjectToString<T extends object>(parameters: T): string {
  return Object.entries(parameters)
    .map((v: [string, any]) => v.join('='))
    .join('&')
}

/**
 * @deprecated
 */
export class QueryParametersUtils {
  static toString = convertQueryParametersObjectToString
}
