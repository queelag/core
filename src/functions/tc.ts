import { Configuration } from '../modules/configuration.js'

/**
 * Try catches a fn, returning both T and U.
 *
 * @template T The return interface or type.
 * @template U The error interface which extends Error.
 */
export function tc<T, U extends Error = Error>(fn: () => T, log: boolean = Configuration.module.tc.log): T | U {
  try {
    return fn()
  } catch (error: any) {
    if (log) {
      console.error(error)
    }

    Configuration.module.tc.onCatch<U>(error, log)

    return error
  }
}
