import { tcp } from './tcp.js'

export async function rvp(fn?: () => any): Promise<void> {
  fn && (await tcp(() => fn()))
}
