import { DEFAULT_WF_MS, DEFAULT_WF_TIMEOUT } from '../definitions/constants.js'
import { tc } from './tc.js'

export async function wf(fn: () => any, ms: number = DEFAULT_WF_MS, timeout: number = DEFAULT_WF_TIMEOUT): Promise<void | Error> {
  return new Promise((resolve) => {
    let et: number, interval: NodeJS.Timeout | number

    /**
     * Elapsed Time
     */
    et = 0

    interval = setInterval(() => {
      let result: any | Error

      if (et >= timeout) {
        clearInterval(interval)
        return resolve(new Error('The wait for timed out.'))
      }

      result = tc(() => fn())
      if (result instanceof Error) {
        clearInterval(interval)
        return resolve(result)
      }

      if (Boolean(result)) {
        clearInterval(interval)
        resolve()
      }

      et += ms
    }, ms)
  })
}
