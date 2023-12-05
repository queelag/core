import { INTERVAL_MAP } from '../definitions/constants.js'
import { IntervalMapKey } from '../definitions/types.js'
import { tc } from '../functions/tc.js'
import { UtilLogger } from '../loggers/util-logger.js'

function set(fn: Function, ms: number, autorun?: boolean): void
function set(name: string, fn: Function, ms: number, autorun?: boolean): void
function set(...args: any[]): void {
  let key: IntervalMapKey, fn: Function, ms: number, autorun: boolean

  key = args[0]
  fn = typeof args[0] === 'function' ? args[0] : args[1]
  ms = typeof args[0] === 'function' ? args[1] : args[2]
  autorun = typeof args[0] === 'function' ? args[2] : args[3]

  clearInterval(INTERVAL_MAP.get(key) as any)
  UtilLogger.debug('setInterval', `The interval ${key} has been cleared.`)

  if (autorun) {
    tc(() => fn())
    UtilLogger.debug('setInterval', `The interval ${key} has been executed.`)
  }

  INTERVAL_MAP.set(key, setInterval(fn, ms))
  UtilLogger.debug('setInterval', `The interval ${key} has been set to run every ${ms}ms.`)
}

function clear(fn: Function): void
function clear(name: string): void
function clear(key: IntervalMapKey): void {
  clearInterval(INTERVAL_MAP.get(key))
  UtilLogger.debug('clearInterval', `The interval ${key} has been cleared.`)

  INTERVAL_MAP.delete(key)
  UtilLogger.debug('clearInterval', `The interval ${key} has been deleted.`)
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
