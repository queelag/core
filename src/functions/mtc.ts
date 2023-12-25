import { tc } from './tc.js'

/**
 * The `mtc` function stands for `make try catch`. It takes a function and returns a function that will return the result of the original function or an error.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/mtc)
 */
export function mtc<T>(fn: (...args: any) => T): (...args: any) => T | Error {
  return (...args: any) => tc(() => fn(...args))
}
