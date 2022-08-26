import { ModuleLogger } from '../loggers/module.logger'

/**
 * A module to handle debouncing.
 *
 * @category Module
 */
export class Debounce {
  /** @internal */
  private static data: Map<Function, NodeJS.Timeout | number> = new Map()

  /**
   * Lets fn run only if it hasn't be called again for ms time.
   */
  static handle(fn: () => any, ms: number): void {
    clearTimeout(this.data.get(fn) as any)
    ModuleLogger.verbose('Debounce', 'handle', `The timeout has been cleared.`, fn)

    this.data.set(fn, setTimeout(fn, ms))
    ModuleLogger.verbose('Debounce', 'handle', `The timeout has been set.`, fn)
  }
}
