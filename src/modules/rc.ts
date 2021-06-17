import { tc } from './tc'

export function rc<T>(fn: () => any, c: T): T {
  tc(() => fn())
  return c
}
