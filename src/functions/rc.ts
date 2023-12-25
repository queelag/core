import { tc } from './tc.js'

/**
 * The `rc` functions stands for `return custom`. It takes a function and a value and returns the value.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/rc)
 */
export function rc<T>(fn: () => any, value: T): T {
  tc(() => fn())
  return value
}
