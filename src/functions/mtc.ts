import { tc } from './tc'

/**
 * Makes a function try catched.
 */
export function mtc<T>(fn: (...args: any) => T): (...args: any) => T | Error {
  return (...args: any) => tc(() => fn(...args))
}
