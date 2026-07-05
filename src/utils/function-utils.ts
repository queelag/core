/**
 * Checks if a value is an instance of a function.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/function)
 */
export function isInstanceOf<I extends NewableFunction>(value: any, instance: I): value is I {
  return value instanceof instance
}

/**
 * Checks if a value is not an instance of a function.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/function)
 */
export function isNotInstanceOf<T, I extends NewableFunction>(value: T, instance: I): value is T {
  return !(value instanceof instance)
}
