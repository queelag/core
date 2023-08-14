import { Configuration } from '../modules/configuration.js'

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
