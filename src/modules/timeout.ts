import { TimeoutMapKey, TimeoutMapValue } from '../definitions/types'
import { ModuleLogger } from '../loggers/module.logger'

/**
 * A module to safely handle timeouts.
 *
 * @category Module
 */
export class Timeout {
  /** @internal */
  private static map: Map<TimeoutMapKey, TimeoutMapValue> = new Map()

  /**
   * Sets a timeout.
   */
  static set(fn: Function, ms: number): void
  static set(name: string, fn: Function, ms: number): void
  static set(...args: any[]): void {
    let key: TimeoutMapKey, fn: Function, ms: number

    key = args[0]
    fn = typeof args[0] === 'function' ? args[0] : args[1]
    ms = typeof args[0] === 'function' ? args[1] : args[2]

    this.map.set(key, setTimeout(fn, ms))
    ModuleLogger.debug('Timeout', 'start', `The timeout ${key} has been set.`)
  }

  /**
   * Unsets a timeout.
   */
  static unset(key: TimeoutMapKey): void {
    let timeout: TimeoutMapValue | undefined

    timeout = this.map.get(key)
    if (!timeout) return ModuleLogger.warn('Timeout', 'unset', `The timeout ${key} is not set.`)

    clearTimeout(timeout)
    ModuleLogger.debug('Timeout', 'unset', `The timeout ${key} has been cleared.`)

    this.map.delete(key)
    ModuleLogger.debug('Timeout', 'unset', `The timeout ${key} has been deleted.`)
  }

  /**
   * Clears all timeouts.
   */
  static clear(): void {
    this.map.forEach(clearTimeout)
    ModuleLogger.debug('Interval', 'clear', `The timeouts have been cleared.`)

    this.map.clear()
    ModuleLogger.debug('Interval', 'clear', `The map has been cleared.`)
  }

  /**
   * Checks whether a timeout is set.
   */
  static isSet(key: TimeoutMapKey): boolean {
    return this.map.has(key)
  }

  /**
   * Checks whether an interval is not set.
   */
  static isNotSet(key: TimeoutMapKey): boolean {
    return this.isSet(key) === false
  }
}
