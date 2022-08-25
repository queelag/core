/**
 * Checks if T is an instance of Error
 */
export function isError<T>(value: T | Error): value is Error {
  return value instanceof Error
}

/**
 * Checks if T is not an instance of Error
 */
export function isNotError<T>(value: T | Error): value is T {
  return !(value instanceof Error)
}
