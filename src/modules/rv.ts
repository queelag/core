import { tc } from './tc'

/**
 * Calls fn whilst returning void
 *
 * Usage:
 *
 * ```typescript
 * import { rv } from '@queelag/core'
 *
 * function mustReturnVoid() {
 *   if (true) return rv(() => true)
 * }
 *
 * console.log(mustReturnVoid())
 * // logs nothing
 * ```
 *
 * @param fn Any function
 */
export function rv(fn: () => any): void {
  tc(() => fn())
}
