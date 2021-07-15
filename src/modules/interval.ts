import { Logger } from './logger'
import { tc } from './tc'

/**
 * A module to safely handle intervals with a name
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
   * Starts an interval
   *
   */
  static start<T extends string>(name: T, fn: () => any, ms: number): void {
    clearInterval(this.data.get(name) as any)
    Logger.debug('Interval', 'start', `The interval with name ${name} has been cleared.`)

    tc(() => fn())
    Logger.debug('Interval', 'start', `The interval with name ${name} has been executed.`)

    this.data.set(name, setInterval(fn, ms))
    Logger.debug('Interval', 'start', `The interval with name ${name} has been set.`)
  }

  /**
   * Stops an interval
   *
   */
  static stop<T extends string>(name: T): void {
    let potential: NodeJS.Timeout | number | undefined

    potential = this.data.get(name)
    if (!potential) return Logger.warn('Interval', 'stop', `No interval with name ${name} has been set.`)

    clearInterval(potential as any)
    Logger.debug('Interval', 'stop', `The interval with name ${name} has been cleared.`)

    this.data.delete(name)
  }

  /**
   * Checks whether an interval is running or not
   *
   */
  static isRunning<T extends string>(name: T): boolean {
    return this.data.has(name)
  }
}
