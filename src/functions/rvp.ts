import { tcp } from './tcp'

/**
 * Calls fn whilst returning void.
 */
export async function rvp(fn?: () => any): Promise<void> {
  fn && (await tcp(() => fn()))
}
