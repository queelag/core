import { THROTTLE_MAP } from '../definitions/constants.js'
import type { ThrottleMapKey } from '../definitions/types.js'
import { FunctionLogger } from '../loggers/function-logger.js'
import { tc } from './tc.js'

/**
 * The `throttle` function is used to prevent a function from being called too many times in a short period.
 * The function will only be called if the time since the last call is greater than or equal to the specified amount of time.
 *
 * Optionally the key can be specified, otherwise the function itself will be used as the key.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/throttle)
 */
export function throttle(fn: Function, ms: number, key: ThrottleMapKey = fn): void {
  let previous: number

  previous = THROTTLE_MAP.get(key) ?? Date.now() - ms
  if (Date.now() - previous < ms)
    return FunctionLogger.verbose('throttle', key, `The current date minus the stored one is greater than or equal to ms`, [
      Date.now(),
      previous,
      Date.now() - previous,
      ms
    ])

  tc(() => fn())
  FunctionLogger.verbose('throttle', key, `The fn has been executed.`)

  THROTTLE_MAP.set(key, Date.now())
  FunctionLogger.verbose('throttle', key, `The date has been set.`)
}
