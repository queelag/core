import { TIMEOUT_MAP } from '../definitions/constants.js'
import { TimeoutMapKey, TimeoutMapValue } from '../definitions/types.js'
import { UtilLogger } from '../loggers/util-logger.js'

/**
 * Sets a timeout to run a function after `ms` milliseconds.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/timeout)
 */
function set(fn: Function, ms: number, key: TimeoutMapKey = fn): void {
  TIMEOUT_MAP.set(key, setTimeout(fn, ms))
  UtilLogger.debug('setTimeout', key, `The timeout has been set.`)
}

/**
 * Clears a timeout.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/timeout)
 */
function clear(key: TimeoutMapKey): void {
  let timeout: TimeoutMapValue | undefined

  timeout = TIMEOUT_MAP.get(key)
  if (!timeout) return UtilLogger.warn('clearTimeout', key, `The timeout  is not set.`)

  clearTimeout(timeout)
  UtilLogger.debug('clearTimeout', key, `The timeout has been cleared.`)

  TIMEOUT_MAP.delete(key)
  UtilLogger.debug('clearTimeout', key, `The timeout has been deleted.`)
}

/**
 * Clears all timeouts.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/timeout)
 */
export function clearEveryTimeout(): void {
  TIMEOUT_MAP.forEach(clearTimeout)
  UtilLogger.debug('clearEveryTimeout', `The timeouts have been cleared.`)

  TIMEOUT_MAP.clear()
  UtilLogger.debug('clearEveryTimeout', `The map has been cleared.`)
}

/**
 * Checks if a timeout is set.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/timeout)
 */
export function isTimeoutSet(key: TimeoutMapKey): boolean {
  return TIMEOUT_MAP.has(key)
}

/**
 * Checks if a timeout is not set.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/timeout)
 */
export function isTimeoutUnset(key: TimeoutMapKey): boolean {
  return !TIMEOUT_MAP.has(key)
}

export { clear as clearTimeout, set as setTimeout }
