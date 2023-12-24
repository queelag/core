/**
 * Checks if an unknown value is an Error.
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}

/**
 * Checks if a value is not an Error.
 */
export function isNotError<T>(value: T | Error): value is T {
  return !(value instanceof Error)
}
