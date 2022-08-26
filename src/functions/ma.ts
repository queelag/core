/**
 * Makes a function async.
 */
export function ma<T>(fn: (...args: any) => T): (...args: any) => Promise<T> {
  return async (...args: any) => fn(...args)
}
