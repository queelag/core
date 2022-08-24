import { IntervalMapKey, IntervalMapValue } from '../definitions/types'
import { tc } from '../functions/tc'
import { ModuleLogger } from '../loggers/module.logger'

/**
 * A module to safely handle intervals with a name.
 *
 * @category Module
 */
export class Interval {
  /** @internal */
  private static map: Map<IntervalMapKey, IntervalMapValue> = new Map()

  /** @hidden */
  constructor() {}

  /**
   * Starts an interval.
   */
  static start(fn: Function, ms: number, autorun?: boolean): void
  static start(name: string, fn: Function, ms: number, autorun?: boolean): void
  static start(...args: any[]): void {
    let key: IntervalMapKey, fn: Function, ms: number, autorun: boolean

    key = args[0]
    fn = typeof args[0] === 'function' ? args[0] : args[1]
    ms = typeof args[0] === 'function' ? args[1] : args[2]
    autorun = typeof args[0] === 'function' ? args[2] : args[3]

    clearInterval(this.map.get(key) as any)
    ModuleLogger.debug('Interval', 'start', `The interval ${key} has been cleared.`)

    if (autorun) {
      tc(() => fn())
      ModuleLogger.debug('Interval', 'start', `The interval ${key} has been executed.`)
    }

    this.map.set(key, setInterval(fn, ms))
    ModuleLogger.debug('Interval', 'start', `The interval ${key} has been set to run every ${ms}ms.`)
  }

  /**
   * Stops an interval.
   */
  static stop(fn: Function): void
  static stop(name: string): void
  static stop(key: IntervalMapKey): void {
    clearInterval(this.map.get(key))
    ModuleLogger.debug('Interval', 'stop', `The interval ${key} has been cleared.`)

    this.map.delete(key)
    ModuleLogger.debug('Interval', 'stop', `The interval ${key} has been deleted.`)
  }

  /**
   * Clears all intervals.
   */
  static clear(): void {
    this.map.forEach(clearTimeout)
    ModuleLogger.debug('Interval', 'clear', `The intervals have been cleared.`)

    this.map.clear()
    ModuleLogger.debug('Interval', 'clear', `The map has been cleared.`)
  }

  /**
   * Checks whether an interval is running.
   */
  static isRunning(key: IntervalMapKey): boolean {
    return this.map.has(key)
  }

  /**
   * Checks whether an interval is not running.
   */
  static isNotRunning(key: IntervalMapKey): boolean {
    return this.isRunning(key) === false
  }
}
