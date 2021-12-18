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
   * Checks if Blob is defined.
   */
  static get isBlobDefined(): boolean {
    return typeof Blob !== 'undefined'
  }

  /**
   * Checks if Blob is not defined.
   */
  static get isBlobNotDefined(): boolean {
    return typeof Blob === 'undefined'
  }

  /**
   * Checks if the NODE_ENV variable is equal to 'development'.
   */
  static get isDevelopment(): boolean {
    return this.NODE_ENV === 'development'
  }

  /**
   * Checks if the NODE_ENV variable is not equal to 'development'.
   */
  static get isNotDevelopment(): boolean {
    return this.NODE_ENV !== 'development'
  }

  /**
   * Checks if fetch is defined.
   */
  static get isFetchDefined(): boolean {
    return typeof fetch !== 'undefined'
  }

  /**
   * Checks if fetch is not defined.
   */
  static get isFetchNotDefined(): boolean {
    return typeof fetch === 'undefined'
  }

  /**
   * Checks if FormData is defined.
   */
  static get isFormDataDefined(): boolean {
    return typeof FormData !== 'undefined'
  }

  /**
   * Checks if FormData is not defined.
   */
  static get isFormDataNotDefined(): boolean {
    return typeof FormData === 'undefined'
  }

  /**
   * Checks if the NODE_ENV variable is equal to 'production'.
   */
  static get isProduction(): boolean {
    return this.NODE_ENV === 'production'
  }

  /**
   * Checks if the NODE_ENV variable is not equal to 'production'.
   */
  static get isNotProduction(): boolean {
    return this.NODE_ENV !== 'production'
  }

  /**
   * Checks if the NODE_ENV variable is equal to 'test'.
   */
  static get isTest(): boolean {
    return this.NODE_ENV === 'test'
  }

  /**
   * Checks if the NODE_ENV variable is not equal to 'test'.
   */
  static get isNotTest(): boolean {
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
