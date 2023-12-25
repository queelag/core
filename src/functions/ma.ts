/**
 * The `ma` function stands for `make async`. It takes a function and returns a function that returns a promise.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/ma)
 */
export function ma<T>(fn: (...args: any) => T | Promise<T>): (...args: any) => Promise<T> {
  return async (...args: any) => fn(...args)
}
