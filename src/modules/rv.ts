import { tc } from './tc'

export function rv(fn: () => any): void {
  tc(() => fn())
}
