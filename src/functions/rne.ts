/**
 * Returns a new error.
 */
export function rne(message?: string, options?: ErrorOptions): Error {
  return new Error(message, options)
}
