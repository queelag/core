import { tc } from './tc.js'

/**
 * Makes a function try catched.
 */
export function mtc<T>(fn: (...args: any) => T): (...args: any) => T | Error {
  return (...args: any) => tc(() => fn(...args))
}
