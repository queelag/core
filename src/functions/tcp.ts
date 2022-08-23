import { Configuration } from '../modules/configuration'

/**
 * Try catches an asynchronous fn, returning both T and U.
 *
 * @template T The return interface or type.
 * @template U The error interface which extends Error.
 */
export async function tcp<T, U extends Error = Error>(fn: () => Promise<T>, verbose: boolean = true): Promise<T | U> {
  try {
    return await fn()
  } catch (error: any) {
    if (verbose) {
      console.error(error)
    }

    Configuration.module.tcp.onCatch<U>(error, verbose)

    return error
  }
}
