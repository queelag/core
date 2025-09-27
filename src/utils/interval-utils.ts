import { INTERVAL_MAP } from '../definitions/constants.js'
import type { SetIntervalOptions } from '../definitions/interfaces.js'
import type { IntervalMapKey } from '../definitions/types.js'
import { tc } from '../functions/tc.js'
import { UtilLogger } from '../loggers/util-logger.js'

/**
 * Sets an interval to run a function every `ms` milliseconds.
 *
 * Optionally the key can be specified, otherwise the function itself will be used as the key.
 * Optionally runs the function immediately with the `autorun` option.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/interval)
 */
function set(fn: Function, ms: number, key: IntervalMapKey = fn, options?: SetIntervalOptions): void {
  clearInterval(INTERVAL_MAP.get(key) as any)
  UtilLogger.debug('setInterval', key, `The interval has been cleared.`)

  if (options?.autorun) {
    tc(() => fn())
    UtilLogger.debug('setInterval', key, `The interval has been executed.`)
  }

  INTERVAL_MAP.set(key, setInterval(fn, ms))
  UtilLogger.debug('setInterval', key, `The interval has been set to run every ${ms}ms.`)
}

/**
 * Clears an interval.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/interval)
 */
function clear(key: IntervalMapKey): void {
  clearInterval(INTERVAL_MAP.get(key))
  UtilLogger.debug('clearInterval', key, `The interval has been cleared.`)

  INTERVAL_MAP.delete(key)
  UtilLogger.debug('clearInterval', key, `The interval  has been deleted.`)
}

/**
 * Clears all intervals.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/interval)
 */
export function clearEveryInterval(): void {
  INTERVAL_MAP.forEach(clearInterval)
  UtilLogger.debug('clearEveryInterval', `The intervals have been cleared.`)

  INTERVAL_MAP.clear()
  UtilLogger.debug('clearEveryInterval', `The map has been cleared.`)
}

/**
 * Checks if an interval is set.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/interval)
 */
export function isIntervalSet(key: IntervalMapKey): boolean {
  return INTERVAL_MAP.has(key)
}

/**
 * Checks if an interval is not set.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/interval)
 */
export function isIntervalUnset(key: IntervalMapKey): boolean {
  return !INTERVAL_MAP.has(key)
}

export { clear as clearInterval, set as setInterval }
