import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Logger, Polyfill, noop } from '../../src'
import { ANSIColor } from '../../src/definitions/enums'

describe('Logger', () => {
  let logger: Logger

  beforeEach(() => {
    logger = new Logger('test', 'verbose', 'on')
    vi.spyOn(console, 'debug').mockImplementation(noop).mockReset()
    vi.spyOn(console, 'error').mockImplementation(noop).mockReset()
    vi.spyOn(console, 'info').mockImplementation(noop).mockReset()
    vi.spyOn(console, 'log').mockImplementation(noop).mockReset()
    vi.spyOn(console, 'warn').mockImplementation(noop).mockReset()
  })

  it('logs to correct channels', () => {
    logger.verbose()
    expect(console.debug).toBeCalledTimes(1)
    logger.debug()
    expect(console.debug).toBeCalledTimes(2)
    logger.info()
    expect(console.info).toBeCalledTimes(1)
    logger.warn()
    expect(console.warn).toBeCalledTimes(1)
    logger.error()
    expect(console.error).toBeCalledTimes(1)
  })

  it('respects the level', () => {
    logger.setLevel('verbose')
    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(2)
    expect(console.info).toBeCalledTimes(1)
    expect(console.warn).toBeCalledTimes(1)
    expect(console.error).toBeCalledTimes(1)

    logger.setLevel('debug')
    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(3)
    expect(console.info).toBeCalledTimes(2)
    expect(console.warn).toBeCalledTimes(2)
    expect(console.error).toBeCalledTimes(2)

    logger.setLevel('info')
    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(3)
    expect(console.info).toBeCalledTimes(3)
    expect(console.warn).toBeCalledTimes(3)
    expect(console.error).toBeCalledTimes(3)

    logger.setLevel('warn')
    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(3)
    expect(console.info).toBeCalledTimes(3)
    expect(console.warn).toBeCalledTimes(4)
    expect(console.error).toBeCalledTimes(4)

    logger.setLevel('error')
    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(3)
    expect(console.info).toBeCalledTimes(3)
    expect(console.warn).toBeCalledTimes(4)
    expect(console.error).toBeCalledTimes(5)
  })

  it('respects the status', () => {
    logger.enable()
    expect(logger.isDisabled).toBeFalsy()
    expect(logger.isEnabled).toBeTruthy()

    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(2)
    expect(console.info).toBeCalledTimes(1)
    expect(console.warn).toBeCalledTimes(1)
    expect(console.error).toBeCalledTimes(1)

    logger.disable()
    expect(logger.isDisabled).toBeTruthy()
    expect(logger.isEnabled).toBeFalsy()

    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(2)
    expect(console.info).toBeCalledTimes(1)
    expect(console.warn).toBeCalledTimes(1)
    expect(console.error).toBeCalledTimes(1)
  })

  it('prints correctly', async () => {
    let data: FormData

    // @ts-ignore
    global.window = {}

    expect(logger.format('debug', 'bigint', 0n)).toStrictEqual(['bigint -> 0'])
    expect(logger.format('debug', 'boolean', false)).toStrictEqual(['boolean -> false'])
    expect(logger.format('debug', 'function', () => true)).toStrictEqual(['function -> () => true'])
    expect(logger.format('debug', 'number', 0)).toStrictEqual(['number -> 0'])
    expect(logger.format('debug', 'object', {})).toStrictEqual(['object', {}])

    expect(logger.format('debug', 'string', '')).toStrictEqual(['string'])
    expect(logger.format('debug', 'string', 'hello')).toStrictEqual(['string -> hello'])

    expect(logger.format('debug', 'symbol', Symbol())).toStrictEqual(['symbol -> Symbol()'])
    expect(logger.format('debug', 'undefined', undefined)).toStrictEqual(['undefined -> undefined'])

    await Polyfill.formData()

    data = new FormData()
    data.append('name', 'john')

    expect(logger.format('debug', 'form-data', data)).toStrictEqual(['form-data', { name: 'john' }])

    // @ts-ignore
    delete global.window
  })

  it('uses ANSI colors in non web environments', () => {
    // @ts-ignore
    delete global.window

    expect(logger.format('verbose', 'number', 0)).toStrictEqual([ANSIColor.WHITE, 'number -> 0'])
    expect(logger.format('verbose', 'object', {})).toStrictEqual([ANSIColor.WHITE, 'object', ANSIColor.RESET, {}])

    expect(logger.format('debug', 'number', 0)).toStrictEqual([ANSIColor.MAGENTA, 'number -> 0'])
    expect(logger.format('info', 'number', 0)).toStrictEqual([ANSIColor.BLUE, 'number -> 0'])
    expect(logger.format('warn', 'number', 0)).toStrictEqual([ANSIColor.YELLOW, 'number -> 0'])
    expect(logger.format('error', 'number', 0)).toStrictEqual([ANSIColor.RED, 'number -> 0'])
  })

  it('gets level and status from the environment', () => {
    process.env.LOGGER_TEST_LEVEL = 'debug'
    process.env.LOGGER_TEST_STATUS = 'off'

    logger = new Logger('TEST')

    expect(logger.level).toBe('debug')
    expect(logger.status).toBe('off')

    delete process.env.LOGGER_TEST_LEVEL
    delete process.env.LOGGER_TEST_STATUS
  })

  it('sets default level and status based on the environment', () => {
    logger = new Logger('TEST')
    expect(logger.level).toBe('warn')
    expect(logger.status).toBe('off')

    process.env.NODE_ENV = 'production'

    logger = new Logger('TEST')
    expect(logger.level).toBe('error')
    expect(logger.status).toBe('on')

    process.env.NODE_ENV = 'test'
  })
})
