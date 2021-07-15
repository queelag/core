/**
 * Try catches an asynchronous fn, returning both T and U
 *
 * Usage:
 *
 * ```typescript
 * import { tc } from '@queelag/core'
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
 *   output = await tc(() => canThrow(false))
 *   if (output instanceof Error) return
 *
 *   // do something
 *
 *   output = await tc(() => canThrow(true))
 *   if (output instanceof Error) return
 *
 *   // execution won't get here
 * }
 *
 * main()
 * ```
 *
 * @template T Any interface or type
 * @template U An error which extends the ES Error
 */
export async function tcp<T, U extends Error = Error>(f: () => Promise<T>, v: boolean = true): Promise<T | U> {
  try {
    return await f()
  } catch (e: any) {
    v && console.error('TryCatchPromise', e)
    return e
  }
}
