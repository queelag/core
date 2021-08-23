import { tcp } from './tcp'

/**
 * Calls fn whilst returning a custom T value.
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
 * @template T The return interface or type.
 */
export async function rcp<T>(fn: () => any, c: T): Promise<T> {
  await tcp(() => fn())
  return c
}
