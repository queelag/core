import { ModuleLogger } from '../loggers/module.logger'
import { tc } from './tc'

/**
 * A module to safely handle intervals with a name.
 *
 * Usage:
 *
 * ```typescript
 * import { Interval } from '@queelag/core'
 *
 * Interval.start('ACTIVITY', () => {
 *   // do something
 * }, 5000)
 *
 * console.log(Interval.isRunning('ACTIVITY'))
 * // logs true
 *
 * setTimeout(() => Interval.stop('ACTIVITY'), 10000)
 * ```
 *
 * @category Module
 */
export class Interval {
  /** @internal */
  private static data: Map<string, NodeJS.Timeout | number> = new Map()

  /** @hidden */
  constructor() {}

  /**
   * Starts an interval.
   */
  static start(name: string, fn: () => any, ms: number): void {
    clearInterval(this.data.get(name) as any)
    ModuleLogger.debug('Interval', 'start', `The interval with name ${name} has been cleared.`)

    tc(() => fn())
    ModuleLogger.debug('Interval', 'start', `The interval with name ${name} has been executed.`)

    this.data.set(name, setInterval(fn, ms))
    ModuleLogger.debug('Interval', 'start', `The interval with name ${name} has been set.`)
  }

  /**
   * Stops an interval.
   */
  static stop(name: string): void {
    let potential: NodeJS.Timeout | number | undefined

    potential = this.data.get(name)
    if (!potential) return ModuleLogger.warn('Interval', 'stop', `No interval with name ${name} has been set.`)

    clearInterval(potential as any)
    ModuleLogger.debug('Interval', 'stop', `The interval with name ${name} has been cleared.`)

    this.data.delete(name)
    ModuleLogger.debug('Interval', 'stop', `The interval with name ${name} has been deleted.`)
  }

  /**
   * Checks whether an interval is running or not.
   */
  static isRunning(name: string): boolean {
    return this.data.has(name)
  }
}
