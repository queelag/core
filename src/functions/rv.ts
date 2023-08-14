import { tc } from './tc.js'

export function rv(fn?: () => any): void {
  fn && tc(() => fn())
}
