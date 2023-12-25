import { tc } from './tc.js'

/**
 * The `rv` function stands for `return void`. It takes a function and returns nothing.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/rv)
 */
export function rv(fn?: () => any): void {
  fn && tc(() => fn())
}
