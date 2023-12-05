import { TIMEOUT_MAP } from '../definitions/constants.js'
import { TimeoutMapKey, TimeoutMapValue } from '../definitions/types.js'
import { UtilLogger } from '../loggers/util-logger.js'

function set(fn: Function, ms: number): void
function set(name: string, fn: Function, ms: number): void
function set(...args: any[]): void {
  let key: TimeoutMapKey, fn: Function, ms: number

  key = args[0]
  fn = typeof args[0] === 'function' ? args[0] : args[1]
  ms = typeof args[0] === 'function' ? args[1] : args[2]

  TIMEOUT_MAP.set(key, setTimeout(fn, ms))
  UtilLogger.debug('setTimeout', `The timeout ${key} has been set.`)
}

function clear(key: TimeoutMapKey): void {
  let timeout: TimeoutMapValue | undefined

  timeout = TIMEOUT_MAP.get(key)
  if (!timeout) return UtilLogger.warn('Timeout', 'unset', `The timeout ${key} is not set.`)

  clearTimeout(timeout)
  UtilLogger.debug('clearTimeout', `The timeout ${key} has been cleared.`)

  TIMEOUT_MAP.delete(key)
  UtilLogger.debug('clearTimeout', `The timeout ${key} has been deleted.`)
}

export function clearEveryTimeout(): void {
  TIMEOUT_MAP.forEach(clearTimeout)
  UtilLogger.debug('clearEveryTimeout', `The timeouts have been cleared.`)

  TIMEOUT_MAP.clear()
  UtilLogger.debug('clearEveryTimeout', `The map has been cleared.`)
}

export function isTimeoutSet(key: TimeoutMapKey): boolean {
  return TIMEOUT_MAP.has(key)
}

export function isTimeoutUnset(key: TimeoutMapKey): boolean {
  return !TIMEOUT_MAP.has(key)
}

export { clear as clearTimeout, set as setTimeout }
