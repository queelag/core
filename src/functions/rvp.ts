import { tcp } from './tcp.js'

/**
 * Calls fn whilst returning void.
 */
export async function rvp(fn?: () => any): Promise<void> {
  fn && (await tcp(() => fn()))
}
