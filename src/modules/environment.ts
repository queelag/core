/**
 * A module to handle environment conditions.
 *
 * Usage:
 *
 * ```typescript
 *   import { Environment } from '@queelag/core'
 *
 *   if (Environment.isProduction) {
 *     console.log('You are on production.')
 *   }
 * ```
 *
 * @category Module
 */
export class Environment {
  /**
   * Checks if the NODE_ENV variable is equal to 'development'.
   */
  static get isDevelopment(): boolean {
    return this.isProcessDefined && process.env.NODE_ENV === 'development'
  }

  /**
   * Checks if the NODE_ENV variable is equal to 'production'.
   */
  static get isProduction(): boolean {
    return this.isProcessDefined && process.env.NODE_ENV === 'production'
  }

  /**
   * Checks if the process module is defined.
   */
  static get isProcessDefined(): boolean {
    return typeof process !== 'undefined'
  }

  /**
   * Checks if the process module is not defined.
   */
  static get isProcessNotDefined(): boolean {
    return typeof process === 'undefined'
  }

  /**
   * Checks if window is defined.
   */
  static get isWindowDefined(): boolean {
    return typeof window !== 'undefined'
  }

  /**
   * Checks if window is not defined.
   */
  static get isWindowNotDefined(): boolean {
    return typeof window === 'undefined'
  }
}
