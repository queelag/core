import { ThrottleMapKey } from '../definitions/types'
import { tc } from '../functions/tc'
import { ModuleLogger } from '../loggers/module.logger'

/**
 * A module to handle functions throttling.
 *
 * @category Module
 */
export class Throttle {
  /** @internal */
  private static map: Map<ThrottleMapKey, number> = new Map()

  /** @hidden */
  constructor() {}

  /**
   * Calls the fn only if ms time has passed since the last execution.
   *
   * @returns
   */
  static handle(fn: Function, ms: number): void
  static handle(name: string, fn: Function, ms: number): void
  static handle(...args: any[]): void {
    let key: string, fn: Function, ms: number, previous: number

    key = args[0]
    fn = typeof args[0] === 'function' ? args[0] : args[1]
    ms = typeof args[0] === 'function' ? args[1] : args[2]

    previous = this.map.get(key) || Date.now() - ms
    if (Date.now() - previous < ms)
      return ModuleLogger.verbose('Throttle', 'handle', `The current date minus the stored one is greater than or equal to ms`, [
        Date.now(),
        previous,
        Date.now() - previous,
        ms
      ])

    tc(() => fn())
    ModuleLogger.verbose('Throttle', 'handle', `The ${key} fn has been executed.`)

    this.map.set(key, Date.now())
    ModuleLogger.verbose('Throttle', 'handle', `The ${key} date has been set.`)
  }
}
