import { Logger } from './logger'

/**
 * A module to handle debouncing
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
   */
  static handle(name: string, fn: () => any, ms: number): void {
    clearTimeout(this.data.get(name) as any)
    Logger.debug('Debounce', 'handle', `The timeout with name ${name} has been cleared.`)

    this.data.set(name, setTimeout(fn, ms))
    Logger.debug('Debounce', 'handle', `The timeout with name ${name} has been memorized.`)
  }
}
