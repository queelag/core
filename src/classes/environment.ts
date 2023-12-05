import {
  getNodeEnv,
  getProcessEnvKey,
  hasProcessEnvKey,
  isBlobDefined,
  isBlobNotDefined,
  isDocumentDefined,
  isDocumentNotDefined,
  isFetchDefined,
  isFetchNotDefined,
  isFileDefined,
  isFileNotDefined,
  isFormDataDefined,
  isFormDataNotDefined,
  isJestDefined,
  isJestNotDefined,
  isNodeEnvDevelopment,
  isNodeEnvNotDevelopment,
  isNodeEnvNotProduction,
  isNodeEnvNotTest,
  isNodeEnvProduction,
  isNodeEnvTest,
  isProcessDefined,
  isProcessNotDefined,
  isWindowDefined,
  isWindowNotDefined
} from '../utils/environment-utils.js'

export class Environment {
  static get(key: string): string {
    return getProcessEnvKey(key)
  }

  static has(key: string): boolean {
    return hasProcessEnvKey(key)
  }

  static get isBlobDefined(): boolean {
    return isBlobDefined()
  }

  static get isBlobNotDefined(): boolean {
    return isBlobNotDefined()
  }

  static get isDevelopment(): boolean {
    return isNodeEnvDevelopment()
  }

  static get isNotDevelopment(): boolean {
    return isNodeEnvNotDevelopment()
  }

  static get isDocumentDefined(): boolean {
    return isDocumentDefined()
  }

  static get isDocumentNotDefined(): boolean {
    return isDocumentNotDefined()
  }

  static get isFetchDefined(): boolean {
    return isFetchDefined()
  }

  static get isFetchNotDefined(): boolean {
    return isFetchNotDefined()
  }

  static get isFileDefined(): boolean {
    return isFileDefined()
  }

  static get isFileNotDefined(): boolean {
    return isFileNotDefined()
  }

  static get isFormDataDefined(): boolean {
    return isFormDataDefined()
  }

  static get isFormDataNotDefined(): boolean {
    return isFormDataNotDefined()
  }

  static get isJestDefined(): boolean {
    return isJestDefined()
  }

  static get isJestNotDefined(): boolean {
    return isJestNotDefined()
  }

  static get isProduction(): boolean {
    return isNodeEnvProduction()
  }

  static get isNotProduction(): boolean {
    return isNodeEnvNotProduction()
  }

  static get isTest(): boolean {
    return isNodeEnvTest()
  }

  static get isNotTest(): boolean {
    return isNodeEnvNotTest()
  }

  static get isProcessDefined(): boolean {
    return isProcessDefined()
  }

  static get isProcessNotDefined(): boolean {
    return isProcessNotDefined()
  }

  static get isWindowDefined(): boolean {
    return isWindowDefined()
  }

  static get isWindowNotDefined(): boolean {
    return isWindowNotDefined()
  }

  static get NODE_ENV(): string {
    return getNodeEnv()
  }
}
