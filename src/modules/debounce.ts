/**
 * A module to handle debouncing.
 *
 * Usage;
 *
 * ```typescript
 * import { Debounce } from '@queelag/core'
 *
 * async function search(): Promise<void> {
 *   // do something asynchronous
 * }
 *
 * document.querySelector('input').addEventListener(() => {
 *   Debounce.handle('INPUT', () => search(), 500)
 * })
 * ```
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
    // ModuleLogger.debug('Debounce', 'handle', `The timeout with name ${name} has been cleared.`)

    this.data.set(name, setTimeout(fn, ms))
    // ModuleLogger.debug('Debounce', 'handle', `The timeout with name ${name} has been memorized.`)
  }
}
