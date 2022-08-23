import { ModuleLogger } from '../loggers/module.logger'

/**
 * A module to handle debouncing.
 *
 * @category Module
 */
export class Debounce {
  /** @internal */
  private static data: Map<string, NodeJS.Timeout | number> = new Map()

  /** @hidden */
  constructor() {}

  /**
   * Lets fn run only if it hasn't be called again for ms time.
   */
  static handle(name: string, fn: () => any, ms: number): void {
    clearTimeout(this.data.get(name) as any)
    ModuleLogger.verbose('Debounce', 'handle', `The timeout with name ${name} has been cleared.`)

    this.data.set(name, setTimeout(fn, ms))
    ModuleLogger.verbose('Debounce', 'handle', `The timeout with name ${name} has been set.`)
  }
}
