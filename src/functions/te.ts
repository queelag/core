/**
 * Throws a new error.
 *
 * @category Function
 */
export function te(message?: string, options?: ErrorOptions): void {
  throw new Error(message, options)
}
