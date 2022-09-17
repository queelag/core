/**
 * Returns a new error.
 */
export function rne(message?: string, options?: any): Error {
  return new Error(message, options)
}
