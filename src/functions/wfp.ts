import { DEFAULT_WFP_MS, DEFAULT_WFP_TIMEOUT } from '../definitions/constants.js'
import { tcp } from './tcp.js'

/**
 * The `wfp` function stands for `wait for promise`. It takes a function that returns a promise and waits for it to resolve to a truthy value or an error.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/wfp)
 */
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
