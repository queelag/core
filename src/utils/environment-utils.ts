import { ProcessEnvValue } from '../definitions/types.js'
import { tc } from '../functions/tc.js'

/**
 * Returns the value of a key in `process.env`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function getProcessEnvKey(key: string): string | undefined {
  let value: ProcessEnvValue | Error

  value = tc(() => process.env[key], false)
  if (value instanceof Error) return undefined

  return value
}

/**
 * Checks if a key exists in `process.env`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function hasProcessEnvKey(key: string): boolean {
  let value: ProcessEnvValue | Error

  value = tc(() => process.env[key], false)
  if (value instanceof Error || typeof value === 'undefined') return false

  return true
}

/**
 * Returns the value of `process.env.NODE_ENV`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function getNodeEnv(): string | undefined {
  let NODE_ENV: string | undefined | Error

  NODE_ENV = tc(() => process.env.NODE_ENV, false)
  if (NODE_ENV instanceof Error) return undefined

  return NODE_ENV
}

/**
 * Checks if `Blob` is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isBlobDefined(): boolean {
  return typeof Blob !== 'undefined'
}

/**
 * Checks if `Blob` is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isBlobNotDefined(): boolean {
  return typeof Blob === 'undefined'
}

/**
 * Checks if `document` is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isDocumentDefined(): boolean {
  return typeof document !== 'undefined'
}

/**
 * Checks if `document` is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isDocumentNotDefined(): boolean {
  return typeof document === 'undefined'
}

/**
 * Checks if `fetch` is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isFetchDefined(): boolean {
  return typeof fetch !== 'undefined'
}

/**
 * Checks if `fetch` is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isFetchNotDefined(): boolean {
  return typeof fetch === 'undefined'
}

/**
 * Checks if `File` is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isFileDefined(): boolean {
  return typeof File !== 'undefined'
}

/**
 * Checks if `File` is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isFileNotDefined(): boolean {
  return typeof File === 'undefined'
}

/**
 * Checks if `FormData` is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isFormDataDefined(): boolean {
  return typeof FormData !== 'undefined'
}

/**
 * Checks if `FormData` is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isFormDataNotDefined(): boolean {
  return typeof FormData === 'undefined'
}

/**
 * Checks if the `process.env.JEST_WORKER_ID` variable is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isJestDefined(): boolean {
  return typeof tc(() => process.env.JEST_WORKER_ID, false) === 'string'
}

/**
 * Checks if the `process.env.JEST_WORKER_ID` variable is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isJestNotDefined(): boolean {
  return typeof tc(() => process.env.JEST_WORKER_ID, false) !== 'string'
}

/**
 * Checks if the `process.env.NODE_ENV` variable is set to `development`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isNodeEnvDevelopment(): boolean {
  return getNodeEnv() === 'development'
}

/**
 * Checks if the `process.env.NODE_ENV` variable is not set to `development`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isNodeEnvNotDevelopment(): boolean {
  return getNodeEnv() !== 'development'
}

/**
 * Checks if the `process.env.NODE_ENV` variable is set to `production`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isNodeEnvProduction(): boolean {
  return getNodeEnv() === 'production'
}

/**
 * Checks if the `process.env.NODE_ENV` variable is not set to `production`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isNodeEnvNotProduction(): boolean {
  return getNodeEnv() !== 'production'
}

/**
 * Checks if the `process.env.NODE_ENV` variable is set to `test`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isNodeEnvTest(): boolean {
  return getNodeEnv() === 'test'
}

/**
 * Checks if the `process.env.NODE_ENV` variable is not set to `test`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isNodeEnvNotTest(): boolean {
  return getNodeEnv() !== 'test'
}

/**
 * Checks if `process` is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isProcessDefined(): boolean {
  return typeof process !== 'undefined'
}

/**
 * Checks if `process` is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isProcessNotDefined(): boolean {
  return typeof process === 'undefined'
}

/**
 * Checks if `TextDecoder` is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isTextDecoderDefined(): boolean {
  return typeof TextDecoder === 'function'
}

/**
 * Checks if `TextDecoder` is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isTextDecoderNotDefined(): boolean {
  return typeof TextDecoder !== 'function'
}

/**
 * Checks if `TextEncoder` is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isTextEncoderDefined(): boolean {
  return typeof TextEncoder === 'function'
}

/**
 * Checks if `TextEncoder` is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isTextEncoderNotDefined(): boolean {
  return typeof TextEncoder !== 'function'
}

/**
 * Checks if `window` is defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isWindowDefined(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Checks if `window` is not defined.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/environment)
 */
export function isWindowNotDefined(): boolean {
  return typeof window === 'undefined'
}
