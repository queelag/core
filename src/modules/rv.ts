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
 */
export function rv(fn: () => any): void {
  tc(() => fn())
}
