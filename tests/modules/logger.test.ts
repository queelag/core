import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Logger, LoggerLevel, LoggerStatus, noop } from '../../src'
import { ANSIColor } from '../../src/definitions/enums'

describe('Logger', () => {
  let logger: Logger

  beforeEach(() => {
    logger = new Logger('test', LoggerLevel.VERBOSE, LoggerStatus.ON)
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
    logger.setLevel(LoggerLevel.VERBOSE)
    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(2)
    expect(console.info).toBeCalledTimes(1)
    expect(console.warn).toBeCalledTimes(1)
    expect(console.error).toBeCalledTimes(1)

    logger.setLevel(LoggerLevel.DEBUG)
    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(3)
    expect(console.info).toBeCalledTimes(2)
    expect(console.warn).toBeCalledTimes(2)
    expect(console.error).toBeCalledTimes(2)

    logger.setLevel(LoggerLevel.INFO)
    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(3)
    expect(console.info).toBeCalledTimes(3)
    expect(console.warn).toBeCalledTimes(3)
    expect(console.error).toBeCalledTimes(3)

    logger.setLevel(LoggerLevel.WARN)
    logger.verbose()
    logger.debug()
    logger.info()
    logger.warn()
    logger.error()
    expect(console.debug).toBeCalledTimes(3)
    expect(console.info).toBeCalledTimes(3)
    expect(console.warn).toBeCalledTimes(4)
    expect(console.error).toBeCalledTimes(4)

    logger.setLevel(LoggerLevel.ERROR)
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

  it('prints correctly', () => {
    let data: FormData

    // @ts-ignore
    global.window = {}

    expect(logger.format('bigint', 0n)).toStrictEqual(['bigint -> 0'])
    expect(logger.format('boolean', false)).toStrictEqual(['boolean -> false'])
    expect(logger.format('function', () => true)).toStrictEqual(['function -> () => true'])
    expect(logger.format('number', 0)).toStrictEqual(['number -> 0'])
    expect(logger.format('object', {})).toStrictEqual(['object', {}])

    expect(logger.format('string', '')).toStrictEqual(['string'])
    expect(logger.format('string', 'hello')).toStrictEqual(['string -> hello'])

    expect(logger.format('symbol', Symbol())).toStrictEqual(['symbol -> Symbol()'])
    expect(logger.format('undefined', undefined)).toStrictEqual(['undefined -> undefined'])

    data = new FormData()
    data.append('name', 'john')

    expect(logger.format('form-data', data)).toStrictEqual(['form-data', { name: 'john' }])

    // @ts-ignore
    delete global.window
  })

  it('uses ANSI colors in non web environments', () => {
    // @ts-ignore
    delete global.window

    expect(logger.format('number', 0)).toStrictEqual([ANSIColor.WHITE, 'number -> 0'])
    expect(logger.format('object', {})).toStrictEqual([ANSIColor.WHITE, 'object', ANSIColor.RESET, {}])

    logger.level = LoggerLevel.DEBUG
    expect(logger.format('number', 0)).toStrictEqual([ANSIColor.MAGENTA, 'number -> 0'])

    logger.level = LoggerLevel.INFO
    expect(logger.format('number', 0)).toStrictEqual([ANSIColor.BLUE, 'number -> 0'])

    logger.level = LoggerLevel.WARN
    expect(logger.format('number', 0)).toStrictEqual([ANSIColor.YELLOW, 'number -> 0'])

    logger.level = LoggerLevel.ERROR
    expect(logger.format('number', 0)).toStrictEqual([ANSIColor.RED, 'number -> 0'])
  })

  it('gets level and status from the environment', () => {
    process.env.LOGGER_TEST_LEVEL = LoggerLevel.DEBUG
    process.env.LOGGER_TEST_STATUS = LoggerStatus.OFF

    logger = new Logger('TEST')

    expect(logger.level).toBe(LoggerLevel.DEBUG)
    expect(logger.status).toBe(LoggerStatus.OFF)

    delete process.env.LOGGER_TEST_LEVEL
    delete process.env.LOGGER_TEST_STATUS
  })

  it('sets default level and status based on the environment', () => {
    logger = new Logger('TEST')
    expect(logger.level).toBe(LoggerLevel.WARN)
    expect(logger.status).toBe(LoggerStatus.OFF)

    process.env.NODE_ENV = 'production'

    logger = new Logger('TEST')
    expect(logger.level).toBe(LoggerLevel.ERROR)
    expect(logger.status).toBe(LoggerStatus.ON)

    process.env.NODE_ENV = 'test'
  })
})
