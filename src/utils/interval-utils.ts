import { INTERVAL_MAP } from '../definitions/constants.js'
import { SetIntervalOptions } from '../definitions/interfaces.js'
import { IntervalMapKey } from '../definitions/types.js'
import { tc } from '../functions/tc.js'
import { UtilLogger } from '../loggers/util-logger.js'

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

function clear(key: IntervalMapKey): void {
  clearInterval(INTERVAL_MAP.get(key))
  UtilLogger.debug('clearInterval', key, `The interval has been cleared.`)

  INTERVAL_MAP.delete(key)
  UtilLogger.debug('clearInterval', key, `The interval  has been deleted.`)
}

export function clearEveryInterval(): void {
  INTERVAL_MAP.forEach(clearInterval)
  UtilLogger.debug('clearEveryInterval', `The intervals have been cleared.`)

  INTERVAL_MAP.clear()
  UtilLogger.debug('clearEveryInterval', `The map has been cleared.`)
}

export function isIntervalSet(key: IntervalMapKey): boolean {
  return INTERVAL_MAP.has(key)
}

export function isIntervalUnset(key: IntervalMapKey): boolean {
  return !INTERVAL_MAP.has(key)
}

export { clear as clearInterval, set as setInterval }
