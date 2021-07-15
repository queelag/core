import { tcp } from './tcp'

/**
 * Calls fn whilst returning a custom T value
 *
 * Usage:
 *
 * ```typescript
 * import { rcp } from '@queelag/core'
 *
 * function mustReturnBoolean(): Promise<boolean> {
 *   if (true) return rc(() => console.log('John'), true)
 * }
 *
 * mustReturnBoolean().then((v) => console.log(v))
 * // logs 'John' and then true
 * ```
 *
 * @param fn Any function
 * @param c A T value
 * @template T Any interface or type
 * @returns Promise<T>
 */
export async function rcp<T>(fn: () => any, c: T): Promise<T> {
  await tcp(() => fn())
  return c
}
