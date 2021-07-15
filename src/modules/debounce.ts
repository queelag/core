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
   * @param name An unique string
   * @param fn A function which will be called only if no other handle with the same name is called after ms time
   * @param ms A number which determines after how many milliseconds the fn needs to be called
   */
  static handle(name: string, fn: () => any, ms: number): void {
    clearTimeout(this.data.get(name) as any)
    Logger.debug('Debounce', 'handle', `The timeout with name ${name} has been cleared.`)

    this.data.set(name, setTimeout(fn, ms))
    Logger.debug('Debounce', 'handle', `The timeout with name ${name} has been memorized.`)
  }
}
