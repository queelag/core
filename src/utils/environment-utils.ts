import { ProcessEnvValue } from '../definitions/types.js'
import { tc } from '../functions/tc.js'

export function getProcessEnvKey(key: string): string {
  let value: ProcessEnvValue | Error

  value = tc(() => process.env[key], false)
  if (value instanceof Error) return ''

  return value ?? ''
}

export function hasProcessEnvKey(key: string): boolean {
  let value: ProcessEnvValue | Error

  value = tc(() => process.env[key], false)
  if (value instanceof Error || typeof value === 'undefined') return false

  return true
}

export function getNodeEnv(): string {
  let NODE_ENV: string | undefined | Error

  NODE_ENV = tc(() => process.env.NODE_ENV, false)
  if (NODE_ENV instanceof Error) return ''

  return NODE_ENV ?? ''
}

export function isBlobDefined(): boolean {
  return typeof Blob !== 'undefined'
}

export function isBlobNotDefined(): boolean {
  return typeof Blob === 'undefined'
}

export function isDocumentDefined(): boolean {
  return typeof document !== 'undefined'
}

export function isDocumentNotDefined(): boolean {
  return typeof document === 'undefined'
}

export function isFetchDefined(): boolean {
  return typeof fetch !== 'undefined'
}

export function isFetchNotDefined(): boolean {
  return typeof fetch === 'undefined'
}

export function isFileDefined(): boolean {
  return typeof File !== 'undefined'
}

export function isFileNotDefined(): boolean {
  return typeof File === 'undefined'
}

export function isFormDataDefined(): boolean {
  return typeof FormData !== 'undefined'
}

export function isFormDataNotDefined(): boolean {
  return typeof FormData === 'undefined'
}

export function isJestDefined(): boolean {
  return typeof tc(() => process.env.JEST_WORKER_ID, false) === 'string'
}

export function isJestNotDefined(): boolean {
  return typeof tc(() => process.env.JEST_WORKER_ID, false) !== 'string'
}

export function isNodeEnvDevelopment(): boolean {
  return getNodeEnv() === 'development'
}

export function isNodeEnvNotDevelopment(): boolean {
  return getNodeEnv() !== 'development'
}

export function isNodeEnvProduction(): boolean {
  return getNodeEnv() === 'production'
}

export function isNodeEnvNotProduction(): boolean {
  return getNodeEnv() !== 'production'
}

export function isNodeEnvTest(): boolean {
  return getNodeEnv() === 'test'
}

export function isNodeEnvNotTest(): boolean {
  return getNodeEnv() !== 'test'
}

export function isProcessDefined(): boolean {
  return typeof process !== 'undefined'
}

export function isProcessNotDefined(): boolean {
  return typeof process === 'undefined'
}

export function isTextDecoderDefined(): boolean {
  return typeof TextDecoder === 'function'
}

export function isTextDecoderNotDefined(): boolean {
  return typeof TextDecoder !== 'function'
}

export function isTextEncoderDefined(): boolean {
  return typeof TextEncoder === 'function'
}

export function isTextEncoderNotDefined(): boolean {
  return typeof TextEncoder !== 'function'
}

export function isWindowDefined(): boolean {
  return typeof window !== 'undefined'
}

export function isWindowNotDefined(): boolean {
  return typeof window === 'undefined'
}
