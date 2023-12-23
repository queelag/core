/**
 * Checks if a value is an instance of a function.
 */
export function isInstanceOf<I extends Function>(value: any, instance: I): value is I {
  return value instanceof instance
}

/**
 * Checks if a value is not an instance of a function.
 */
export function isNotInstanceOf<T, I extends Function>(value: T, instance: I): value is T {
  return !(value instanceof instance)
}
