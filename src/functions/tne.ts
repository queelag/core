/**
 * Throws a new error.
 */
export function tne(message?: string, options?: ErrorOptions): void {
  throw new Error(message, options)
}
