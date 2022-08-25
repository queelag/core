/**
 * Throws a new error.
 *
 * @category Function
 */
export function tne(message?: string, options?: ErrorOptions): void {
  throw new Error(message, options)
}
