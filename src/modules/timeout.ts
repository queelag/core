import { TimeoutMapKey, TimeoutMapValue } from '../definitions/types.js'
import { ModuleLogger } from '../loggers/module-logger.js'

/**
 * @category Module
 */
export class Timeout {
  /** @internal */
  private static map: Map<TimeoutMapKey, TimeoutMapValue> = new Map()

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

  static unset(key: TimeoutMapKey): void {
    let timeout: TimeoutMapValue | undefined

    timeout = this.map.get(key)
    if (!timeout) return ModuleLogger.warn('Timeout', 'unset', `The timeout ${key} is not set.`)

    clearTimeout(timeout)
    ModuleLogger.debug('Timeout', 'unset', `The timeout ${key} has been cleared.`)

    this.map.delete(key)
    ModuleLogger.debug('Timeout', 'unset', `The timeout ${key} has been deleted.`)
  }

  static clear(): void {
    this.map.forEach(clearTimeout)
    ModuleLogger.debug('Interval', 'clear', `The timeouts have been cleared.`)

    this.map.clear()
    ModuleLogger.debug('Interval', 'clear', `The map has been cleared.`)
  }

  static isSet(key: TimeoutMapKey): boolean {
    return this.map.has(key)
  }

  static isNotSet(key: TimeoutMapKey): boolean {
    return this.isSet(key) === false
  }
}
