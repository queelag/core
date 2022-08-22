import { ModuleLogger } from '@/loggers/module.logger'

/**
 * A module to safely handle timeouts.
 *
 * @category Module
 */
export class Timeout {
  /** @internal */
  private static data: Map<string, NodeJS.Timeout | number> = new Map()

  /** @hidden */
  constructor() {}

  /**
   * Calls a fn after ms time.
   */
  static set(name: string, fn: () => any, ms: number): void {
    this.data.set(name, setTimeout(fn, ms))
    ModuleLogger.debug('Timeout', 'start', `The timeout with name ${name} has been set.`)
  }

  /**
   * Clears a timeout, blocking its eventual execution.
   */
  static clear(name: string): void {
    let potential: NodeJS.Timeout | number | undefined

    potential = this.data.get(name)
    if (!potential) return ModuleLogger.error('Timeout', 'stop', `No timeout with name ${name} has been set.`)

    clearTimeout(potential as any)
    ModuleLogger.debug('Timeout', 'stop', `The timeout with name ${name} has been cleared.`)
  }
}
