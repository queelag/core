/**
 * Converts an object to a chain of query parameters.
 *
 * @template T The object interface.
 */
export function serializeQueryParameters<T extends object>(parameters: T): string {
  let search: string[] = []

  for (let key in parameters) {
    search.push(key + '=' + parameters[key])
  }

  return search.join('&')
}
