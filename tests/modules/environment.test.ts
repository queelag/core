import { Environment, Polyfill } from '../../src'

describe('Environment', () => {
  let env: NodeJS.ProcessEnv

  it('gets a variable from process.env', () => {
    expect(Environment.get('NODE_ENV')).toBe('test')
    expect(Environment.get('UNKNOWN')).toBe('')

    env = process.env
    // @ts-ignore
    delete process.env

    expect(Environment.get('')).toBe('')

    process.env = env
  })

  it('check if a variable is inside process.env', () => {
    expect(Environment.has('NODE_ENV')).toBeTruthy()
    expect(Environment.has('UNKNOWN')).toBeFalsy()
  })

  it('checks if blob is defined', () => {
    expect(Environment.isBlobDefined).toBeTruthy()
    expect(Environment.isBlobNotDefined).toBeFalsy()
  })

  it('checks if NODE_ENV is development', () => {
    expect(Environment.isDevelopment).toBeFalsy()
    expect(Environment.isNotDevelopment).toBeTruthy()
  })

  it('checks if document is defined', () => {
    expect(Environment.isDocumentDefined).toBeTruthy()
    expect(Environment.isDocumentNotDefined).toBeFalsy()
  })

  it('checks if fetch is defined', () => {
    expect(Environment.isFetchDefined).toBeTruthy()
    expect(Environment.isFetchNotDefined).toBeFalsy()
  })

  it('checks if file is defined', async () => {
    await Polyfill.file()

    expect(Environment.isFileDefined).toBeTruthy()
    expect(Environment.isFileNotDefined).toBeFalsy()
  })

  it('checks if form data is defined', () => {
    expect(Environment.isFormDataDefined).toBeTruthy()
    expect(Environment.isFormDataNotDefined).toBeFalsy()
  })

  it('checks if JEST_WORKER_ID is defined', () => {
    expect(Environment.isJest).toBeTruthy()
    expect(Environment.isNotJest).toBeFalsy()
  })

  it('checks if NODE_ENV is production', () => {
    expect(Environment.isProduction).toBeFalsy()
    expect(Environment.isNotProduction).toBeTruthy()
  })

  it('checks if NODE_ENV is test', () => {
    expect(Environment.isTest).toBeTruthy()
    expect(Environment.isNotTest).toBeFalsy()
  })

  it('checks if process is defined', () => {
    expect(Environment.isProcessDefined).toBeTruthy()
    expect(Environment.isProcessNotDefined).toBeFalsy()
  })

  it('checks if window is defined', () => {
    expect(Environment.isWindowDefined).toBeTruthy()
    expect(Environment.isWindowNotDefined).toBeFalsy()
  })

  it('returns the NODE_ENV value', () => {
    expect(Environment.NODE_ENV).toBe('test')

    env = process.env
    // @ts-ignore
    delete process.env

    expect(Environment.NODE_ENV).toBe('')
    process.env = {}
    expect(Environment.NODE_ENV).toBe('')

    process.env = env
  })
})
