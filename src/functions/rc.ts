import { tc } from './tc.js'

export function rc<T>(fn: () => any, c: T): T {
  tc(() => fn())
  return c
}
