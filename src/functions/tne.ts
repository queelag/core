/**
 * The `tne` function stands for `throw new error`. It takes a message and options and throws a new error.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/tne)
 */
export function tne(message?: string, options?: any): void {
  throw new Error(message, options)
}
