/**
 * Try catches an asynchronous fn, returning both T and U.
 *
 * Usage:
 *
 * ```typescript
 * import { tcp } from '@queelag/core'
 *
 * async function canThrow(throws: boolean): Promise<string> {
 *   if (throws) {
 *     throw new Error()
 *   }
 *
 *   return ''
 * }
 *
 * async function main() {
 *   let output: string | Error
 *
 *   output = await tcp(() => canThrow(false))
 *   if (output instanceof Error) return
 *
 *   // do something
 *
 *   output = await tcp(() => canThrow(true))
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
export async function tcp<T, U extends Error = Error>(fn: () => Promise<T>, verbose: boolean = true): Promise<T | U> {
  try {
    return await fn()
  } catch (e: any) {
    if (verbose) {
      console.error(e)
    }

    return e
  }
}
