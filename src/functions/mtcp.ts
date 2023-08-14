import { tcp } from './tcp.js'

export function mtcp<T>(fn: (...args: any) => Promise<T>): (...args: any) => Promise<T | Error> {
  return (...args: any) => tcp(() => fn(...args))
}
