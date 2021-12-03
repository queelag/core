import { noop } from './noop'
import { tc } from './tc'

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
   * Returns a webpack safe require.
   */
  static get require(): NodeRequire {
    // @ts-ignore
    return typeof __webpack_require__ === 'function' ? __non_webpack_require__ : typeof require === 'function' ? require : noop
  }

  /**
   * Checks if the NODE_ENV variable is equal to 'development'.
   */
  static get isDevelopment(): boolean {
    return this.NODE_ENV === 'development'
  }

  /**
   * Checks if the NODE_ENV variable is equal to 'production'.
   */
  static get isProduction(): boolean {
    return this.NODE_ENV === 'production'
  }

  /**
   * Checks if the NODE_ENV variable is equal to 'test'.
   */
  static get isTest(): boolean {
    return this.NODE_ENV === 'test'
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

  static get NODE_ENV(): string {
    let NODE_ENV: string | undefined | Error

    NODE_ENV = tc(() => process.env.NODE_ENV, false)
    if (NODE_ENV instanceof Error) return ''

    return NODE_ENV || ''
  }
}
