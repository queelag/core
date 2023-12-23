import { tcp } from './tcp.js'

/**
 * The `rcp` functions stands for `return custom promise`. It takes a function and a value and returns a promise that resolves to the value.
 */
export async function rcp<T>(fn: () => any, value: T): Promise<T> {
  await tcp(() => fn())
  return value
}
