/**
 * Checks if an unknown value is an Error.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/error)
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}

/**
 * Checks if a value is not an Error.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/error)
 */
export function isNotError<T>(value: T | Error): value is T {
  return !(value instanceof Error)
}
