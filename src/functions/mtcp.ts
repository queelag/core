import { tcp } from './tcp'

/**
 * Makes an async function try catched.
 */
export function mtcp<T>(fn: (...args: any) => Promise<T>): (...args: any) => Promise<T | Error> {
  return (...args: any) => tcp(() => fn(...args))
}
