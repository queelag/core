import { Configuration } from '../classes/configuration.js'

/**
 * The `tcp` function stands for `try catch promise`. It takes a function and returns a promise that resolves to the result of the function or the error that was thrown.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/tcp)
 */
export async function tcp<T, U extends Error = Error>(fn: () => Promise<T>, log: boolean = Configuration.functions.tcp.log): Promise<T | U> {
  try {
    return await fn()
  } catch (error: any) {
    if (log) {
      console.error(error)
    }

    Configuration.functions.tcp.onCatch<U>(error, log)

    return error
  }
}
