/**
 * The `rne` function stands for `return new error`. It takes a message and options and returns a new error.
 */
export function rne(message?: string, options?: any): Error {
  return new Error(message, options)
}
