import { tc } from './tc'

/**
 * Calls fn whilst returning a custom T value.
 *
 * @template T The return interface or type.
 */
export function rc<T>(fn: () => any, c: T): T {
  tc(() => fn())
  return c
}
