export function tne(message?: string, options?: any): void {
  throw new Error(message, options)
}
