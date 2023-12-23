import { tcp } from './tcp.js'

/**
 * The `mtcp` function stands for `make try catch promise`. It takes an async function and returns a function that will return the result of the original function or an error.
 */
export function mtcp<T>(fn: (...args: any) => Promise<T>): (...args: any) => Promise<T | Error> {
  return (...args: any) => tcp(() => fn(...args))
}
