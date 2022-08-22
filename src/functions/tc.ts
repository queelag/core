import { Configuration } from '@/modules/configuration'

/**
 * Try catches a fn, returning both T and U.
 *
 * @template T The return interface or type.
 * @template U The error interface which extends Error.
 */
export function tc<T, U extends Error = Error>(fn: () => T, verbose: boolean = true): T | U {
  try {
    return fn()
  } catch (error: any) {
    if (verbose) {
      console.error(error)
    }

    Configuration.data.module.tc.onCatch<U>(error, verbose)

    return error
  }
}
