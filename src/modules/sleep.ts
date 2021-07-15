/**
 * A module to handle sleeping
 *
 * Usage:
 *
 * ```typescript
 * import { Sleep } from '@queelag/core'
 *
 * async function sendMessageToServer() {
 *   // do something
 *   await Sleep.for(1000)
 *   // do something after 1 second
 * }
 * ```
 *
 * @category Module
 */
export class Sleep {
  /** @hidden */
  constructor() {}

  /**
   * Waits for ms time
   *
   * @param ms A number which determines the duration of the sleep in milliseconds
   * @returns
   */
  static async for(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(() => r(), ms))
  }
}
