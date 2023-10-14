export function ma<T>(fn: (...args: any) => T | Promise<T>): (...args: any) => Promise<T> {
  return async (...args: any) => fn(...args)
}
