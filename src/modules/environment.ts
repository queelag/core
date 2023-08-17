import { ProcessEnvValue } from '../definitions/types.js'
import { tc } from '../functions/tc.js'

/**
 * @category Module
 */
export class Environment {
  static get(key: string): string {
    let value: ProcessEnvValue | Error

    value = tc(() => process.env[key], false)
    if (value instanceof Error) return ''

    return value || ''
  }

  static has(key: string): boolean {
    let value: ProcessEnvValue | Error

    value = tc(() => process.env[key], false)
    if (value instanceof Error || typeof value === 'undefined') return false

    return true
  }

  static get isBlobDefined(): boolean {
    return typeof Blob !== 'undefined'
  }

  static get isBlobNotDefined(): boolean {
    return typeof Blob === 'undefined'
  }

  static get isDevelopment(): boolean {
    return this.NODE_ENV === 'development'
  }

  static get isNotDevelopment(): boolean {
    return this.NODE_ENV !== 'development'
  }

  static get isDocumentDefined(): boolean {
    return typeof document !== 'undefined'
  }

  static get isDocumentNotDefined(): boolean {
    return typeof document === 'undefined'
  }

  static get isFetchDefined(): boolean {
    return typeof fetch !== 'undefined'
  }

  static get isFetchNotDefined(): boolean {
    return typeof fetch === 'undefined'
  }

  static get isFileDefined(): boolean {
    return typeof File !== 'undefined'
  }

  static get isFileNotDefined(): boolean {
    return typeof File === 'undefined'
  }

  static get isFormDataDefined(): boolean {
    return typeof FormData !== 'undefined'
  }

  static get isFormDataNotDefined(): boolean {
    return typeof FormData === 'undefined'
  }

  static get isJest(): boolean {
    return typeof tc(() => process.env.JEST_WORKER_ID, false) === 'string'
  }

  static get isNotJest(): boolean {
    return typeof tc(() => process.env.JEST_WORKER_ID, false) !== 'string'
  }

  static get isProduction(): boolean {
    return this.NODE_ENV === 'production'
  }

  static get isNotProduction(): boolean {
    return this.NODE_ENV !== 'production'
  }

  static get isTest(): boolean {
    return this.NODE_ENV === 'test'
  }

  static get isNotTest(): boolean {
    return this.NODE_ENV !== 'test'
  }

  static get isProcessDefined(): boolean {
    return typeof process !== 'undefined'
  }

  static get isProcessNotDefined(): boolean {
    return typeof process === 'undefined'
  }

  static get isWindowDefined(): boolean {
    return typeof window !== 'undefined'
  }

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
