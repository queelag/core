import { tcp } from './tcp'

/**
 * Calls fn whilst returning a custom T value.
 *
 * @template T The return interface or type.
 */
export async function rcp<T>(fn: () => any, c: T): Promise<T> {
  await tcp(() => fn())
  return c
}
