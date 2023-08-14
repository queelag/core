import { tc } from './tc.js'

export function mtc<T>(fn: (...args: any) => T): (...args: any) => T | Error {
  return (...args: any) => tc(() => fn(...args))
}
