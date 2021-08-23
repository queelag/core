import { tc } from './tc'

/**
 * Calls fn whilst returning a custom T value.
 *
 * Usage:
 *
 * ```typescript
 * import { rc } from '@queelag/core'
 *
 * function mustReturnBoolean(): boolean {
 *   if (true) return rc(() => console.log('John'), true)
 * }
 *
 * console.log(mustReturnBoolean())
 * // logs 'John' and then true
 * ```
 *
 * @template T The return interface or type.
 */
export function rc<T>(fn: () => any, c: T): T {
  tc(() => fn())
  return c
}
