/**
 * Checks if the given value is an Error.
 */
export function isError<T>(value: T | Error): value is Error {
  return value instanceof Error
}

/**
 * Checks if the given value is not an Error.
 */
export function isNotError<T>(value: T | Error): value is T {
  return !(value instanceof Error)
}
