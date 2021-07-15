/**
 * Try catches a fn, returning both T and U
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
 * @param fn Any function which returns T
 * @param v A boolean, if true the caught error will be logged to the console
 * @template T Any interface or type
 * @template U An error which extends the ES Error
 * @returns T | U
 */
export function tc<T, U extends Error = Error>(fn: () => T, v: boolean = true): T | U {
  try {
    return fn()
  } catch (e: any) {
    v && console.error(e)
    return e
  }
}
