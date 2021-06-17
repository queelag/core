import { tcp } from './tcp'

export async function rcp<T>(fn: () => any, c: T): Promise<T> {
  await tcp(() => fn())
  return c
}
