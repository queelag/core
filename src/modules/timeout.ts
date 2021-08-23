import { Logger } from './logger'

/**
 * A module to safely handle timeouts.
 *
 * Usage:
 *
 * ```typescript
 * import { Timeout } from '@queelag/core'
 *
 * Timeout.set('DELAYED_OPERATION', () => {
 *   // do something
 * }, 1000)
 *
 * Timeout.clear('DELAYED_OPERATION')
 * // or maybe do not
 * ```
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
    Logger.debug('Timeout', 'start', `The timeout with name ${name} has been set.`)
  }

  /**
   * Clears a timeout, blocking its eventual execution.
   */
  static clear(name: string): void {
    let potential: NodeJS.Timeout | number | undefined

    potential = this.data.get(name)
    if (!potential) return Logger.error('Timeout', 'stop', `No timeout with name ${name} has been set.`)

    clearTimeout(potential as any)
    Logger.debug('Timeout', 'stop', `The timeout with name ${name} has been cleared.`)
  }
}
