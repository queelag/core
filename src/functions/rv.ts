import { tc } from './tc.js'

/**
 * The `rv` function stands for `return void`. It takes a function and returns nothing.
 */
export function rv(fn?: () => any): void {
  fn && tc(() => fn())
}
