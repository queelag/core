import { DEFAULT_WFP_MS, DEFAULT_WFP_TIMEOUT } from '../definitions/constants.js'
import { tcp } from './tcp.js'

export async function wfp(fn: () => Promise<any>, ms: number = DEFAULT_WFP_MS, timeout: number = DEFAULT_WFP_TIMEOUT): Promise<void | Error> {
  return new Promise((resolve) => {
    let et: number, interval: NodeJS.Timeout | number

    /**
     * Elapsed Time
     */
    et = 0

    interval = setInterval(() => {
      if (et >= timeout) {
        clearInterval(interval)
        return resolve(new Error('The wait for timed out.'))
      }

      tcp(() => fn()).then((result: unknown) => {
        if (result instanceof Error) {
          clearInterval(interval)
          return resolve(result)
        }

        if (result) {
          clearInterval(interval)
          resolve()
        }

        et += ms
      })
    }, ms)
  })
}
