/**
 * Deserializes a query parameters string to a T object.
 */
export function deserializeQueryParameters<T extends Record<string, string>>(parameters: string): T {
  let params: URLSearchParams, object: T

  params = new URLSearchParams(parameters)
  object = {} as T

  for (let [k, v] of params.entries()) {
    object[k as keyof T] = v as T[keyof T]
  }

  return object
}

/**
 * Serializes a T object to a query parameters string.
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
