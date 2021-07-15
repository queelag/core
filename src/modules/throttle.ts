import { tc } from './tc'

/**
 * A module to handle functions throttling
 *
 * Usage:
 *
 * ```typescript
 * import { Throttle } from '@queelag/core'
 *
 * window.addEventListener('scroll', () => Throttle.handle('WINDOW_SCROLL', () => {
 *   // do something
 * }, 250))
 * // now the scroll listener will only be called if 250 milliseconds have passed since its last execution
 * ```
 *
 * @category Module
 */
export class Throttle {
  /** @internal */
  private static data: Map<string, number> = new Map()

  /** @hidden */
  constructor() {}

  /**
   * Calls the fn only if ms time has passed since the last execution
   *
   * @param name An unique string
   * @param fn Any function
   * @param ms A number which determines how many milliseconds must have passed to allow the fn to be called
   * @returns
   */
  static handle<T extends string>(name: T, fn: () => any, ms: number): void {
    let previous: number

    previous = this.data.get(name) || Date.now() - ms
    if (Date.now() - previous < ms) return

    tc(() => fn())

    this.data.set(name, Date.now())
  }
}
