import { describe, expect, it } from 'vitest'
import {
  getNodeEnv,
  getProcessEnvKey,
  hasProcessEnvKey,
  importNodeFetch,
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
  isWindowNotDefined,
  useNodeFetch
} from '../../src'

describe('Environment Utils', () => {
  let env: NodeJS.ProcessEnv

  it('gets a variable from process.env', () => {
    expect(getProcessEnvKey('NODE_ENV')).toBe('test')
    expect(getProcessEnvKey('UNKNOWN')).toBe('')

    env = process.env
    // @ts-ignore
    delete process.env

    expect(getProcessEnvKey('')).toBe('')

    process.env = env
  })

  it('check if a variable is inside process.env', () => {
    expect(hasProcessEnvKey('NODE_ENV')).toBeTruthy()
    expect(hasProcessEnvKey('UNKNOWN')).toBeFalsy()
  })

  it('checks if blob is defined', async () => {
    await useNodeFetch(await importNodeFetch())

    expect(isBlobDefined()).toBeTruthy()
    expect(isBlobNotDefined()).toBeFalsy()
  })

  it('checks if NODE_ENV is development', () => {
    expect(isNodeEnvDevelopment()).toBeFalsy()
    expect(isNodeEnvNotDevelopment()).toBeTruthy()
  })

  it('checks if document is defined', () => {
    expect(isDocumentDefined()).toBeFalsy()
    expect(isDocumentNotDefined()).toBeTruthy()
  })

  it('checks if fetch is defined', async () => {
    await useNodeFetch(await importNodeFetch())

    expect(isFetchDefined()).toBeTruthy()
    expect(isFetchNotDefined()).toBeFalsy()
  })

  it('checks if file is defined', async () => {
    await useNodeFetch(await importNodeFetch())

    expect(isFileDefined()).toBeTruthy()
    expect(isFileNotDefined()).toBeFalsy()
  })

  it('checks if form data is defined', async () => {
    await useNodeFetch(await importNodeFetch())

    expect(isFormDataDefined()).toBeTruthy()
    expect(isFormDataNotDefined()).toBeFalsy()
  })

  it('checks if JEST_WORKER_ID is defined', () => {
    expect(isJestDefined()).toBeFalsy()
    expect(isJestNotDefined()).toBeTruthy()
  })

  it('checks if NODE_ENV is production', () => {
    expect(isNodeEnvProduction()).toBeFalsy()
    expect(isNodeEnvNotProduction()).toBeTruthy()
  })

  it('checks if NODE_ENV is test', () => {
    expect(isNodeEnvTest()).toBeTruthy()
    expect(isNodeEnvNotTest()).toBeFalsy()
  })

  it('checks if process is defined', () => {
    expect(isProcessDefined()).toBeTruthy()
    expect(isProcessNotDefined()).toBeFalsy()
  })

  it('checks if window is defined', () => {
    expect(isWindowDefined()).toBeFalsy()
    expect(isWindowNotDefined()).toBeTruthy()
  })

  it('returns the NODE_ENV value', () => {
    expect(getNodeEnv()).toBe('test')

    env = process.env
    // @ts-ignore
    delete process.env

    expect(getNodeEnv()).toBe('')
    process.env = {}
    expect(getNodeEnv()).toBe('')

    process.env = env
  })
})
