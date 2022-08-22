import { tc } from '@/functions/tc'

/**
 * A module to handle functions throttling.
 *
 * @category Module
 */
export class Throttle {
  /** @internal */
  private static data: Map<string, number> = new Map()

  /** @hidden */
  constructor() {}

  /**
   * Calls the fn only if ms time has passed since the last execution.
   *
   * @returns
   */
  static handle(name: string, fn: () => any, ms: number): void {
    let previous: number

    previous = this.data.get(name) || Date.now() - ms
    if (Date.now() - previous < ms) return

    tc(() => fn())

    this.data.set(name, Date.now())
  }
}
