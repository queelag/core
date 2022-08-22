import { tc } from './tc'

/**
 * Calls fn whilst returning void.
 */
export function rv(fn: () => any): void {
  tc(() => fn())
}
