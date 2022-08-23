import { Configuration } from '../modules/configuration'

/**
 * Try catches an asynchronous fn, returning both T and U.
 *
 * @template T The return interface or type.
 * @template U The error interface which extends Error.
 */
export async function tcp<T, U extends Error = Error>(fn: () => Promise<T>, log: boolean = Configuration.module.tcp.log): Promise<T | U> {
  try {
    return await fn()
  } catch (error: any) {
    if (log) {
      console.error(error)
    }

    Configuration.module.tcp.onCatch<U>(error, log)

    return error
  }
}
