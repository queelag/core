import { Configuration } from '../classes/configuration.js'

export function tc<T, U extends Error = Error>(fn: () => T, log: boolean = Configuration.functions.tc.log): T | U {
  try {
    return fn()
  } catch (error: any) {
    if (log) {
      console.error(error)
    }

    Configuration.functions.tc.onCatch<U>(error, log)

    return error
  }
}
