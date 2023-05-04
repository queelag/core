import { tc } from './tc.js'

/**
 * Calls fn whilst returning void.
 */
export function rv(fn?: () => any): void {
  fn && tc(() => fn())
}
