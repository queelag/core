import { tcp } from './tcp.js'

/**
 * The `rvp` function stands for `return void promise`. It takes a function and returns a promise that resolves to nothing.
 */
export async function rvp(fn?: () => any): Promise<void> {
  fn && (await tcp(() => fn()))
}
