/**
 * Try catches a fn, returning both T and U.
 *
 * Usage:
 *
 * ```typescript
 * import { tc } from '@queelag/core'
 *
 * function canThrow(throws: boolean): string {
 *   if (throws) {
 *     throw new Error()
 *   }
 *
 *   return ''
 * }
 *
 * function main() {
 *   let output: string | Error
 *
 *   output = tc(() => canThrow(false))
 *   if (output instanceof Error) return
 *
 *   // do something
 *
 *   output = tc(() => canThrow(true))
 *   if (output instanceof Error) return
 *
 *   // execution won't get here
 * }
 *
 * main()
 * ```
 *
 * @template T The return interface or type.
 * @template U The error interface which extends Error.
 */
export function tc<T, U extends Error = Error>(fn: () => T, verbose: boolean = true): T | U {
  try {
    return fn()
  } catch (e: any) {
    if (verbose) {
      console.error(e)
    }

    return e
  }
}
