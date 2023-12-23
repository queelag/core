/**
 * The `tie` function stands for `throw if error`. It takes a value and throws an error if the value is an error.
 */
export function tie<T, U extends Error = Error>(value: T | U): T {
  if (value instanceof Error) {
    throw value
  }

  return value
}
