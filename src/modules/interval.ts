import { ModuleLogger } from '@/loggers/module.logger'

/**
 * A module to safely handle intervals with a name.
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

    // tc(() => fn())
    // ModuleLogger.debug('Interval', 'start', `The interval with name ${name} has been executed.`)

    this.data.set(name, setInterval(fn, ms))
    ModuleLogger.debug('Interval', 'start', `The interval with name ${name} has been set to run every ${ms}ms.`)
  }

  /**
   * Stops an interval.
   */
  static stop(name: string): void {
    clearInterval(this.data.get(name) as any)
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
