import { DEFAULT_LOGGER_COLORS, DEFAULT_LOGGER_SEPARATOR, LOGGER_LEVELS, LOGGER_STATUSES } from '../definitions/constants.js'
import { ANSIColor } from '../definitions/enums.js'
import { LoggerLevel, LoggerStatus } from '../definitions/types.js'
import { deserializeFormData } from '../utils/form-data-utils.js'
import { getLoggerANSIColor } from '../utils/logger-utils.js'
import { Environment } from './environment.js'

/**
 * A module to print prettier logs.
 *
 * @category Module
 */
export class Logger {
  /**
   * A boolean which determines if colors are used or not in non browser environments.
   */
  colors: boolean
  /**
   * A {@link LoggerLevel} which determines the logs that are printed.
   */
  level: LoggerLevel
  /**
   * A string which determines the name of this ModuleLogger.
   */
  name: string
  /**
   * A string which separates the logged args.
   */
  separator: string
  /**
   * A {@link LoggerStatus}.
   */
  status: LoggerStatus

  constructor(
    name: string,
    level: LoggerLevel = Logger.getLevelFromEnvironment(name) || (Environment.isProduction ? 'error' : 'warn'),
    status: LoggerStatus = Logger.getStatusFromEnvironment(name) || (Environment.isTest ? 'off' : 'on'),
    colors: boolean = DEFAULT_LOGGER_COLORS,
    separator: string = DEFAULT_LOGGER_SEPARATOR
  ) {
    this.colors = colors
    this.level = level
    this.name = name
    this.separator = separator
    this.status = status
  }

  /**
   * Logs a verbose message to the console.
   */
  verbose(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelVerboseDisabled) return

    console.debug(...this.format('verbose', ...args))
  }

  /**
   * Logs a debug message to the console.
   */
  debug(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelDebugDisabled) return

    console.debug(...this.format('debug', ...args))
  }

  /**
   * Logs an info message to the console.
   */
  info(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelInfoDisabled) return

    console.info(...this.format('info', ...args))
  }

  /**
   * Logs a warn message to the console.
   */
  warn(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelWarnDisabled) return

    console.warn(...this.format('warn', ...args))
  }

  /**
   * Logs an error message to the console.
   */
  error(...args: any[]): void {
    if (this.isDisabled) return

    console.error(...this.format('error', ...args))
  }

  /**
   * Disables verbose, debug, info, warn and error logs.
   */
  disable(): void {
    this.status = 'off'
  }

  /**
   * Enables verbose, debug, info, warn and error logs.
   */
  enable(): void {
    this.status = 'on'
  }

  /**
   * Sets the level.
   */
  setLevel(level: LoggerLevel): void {
    this.level = level
  }

  /**
   * Disables the colors
   */
  disableColors(): void {
    this.colors = false
  }

  /**
   * Enables the colors
   */
  enableColors(): void {
    this.colors = true
  }

  /**
   * Formats the args to be easier to read.
   */
  format(level: LoggerLevel, ...args: any[]): any[] {
    let print: any[], primitives: string[]

    print = []
    primitives = []

    for (let arg of args) {
      if (typeof arg !== 'object') {
        if (String(arg).length <= 0) continue

        primitives.push(String(arg))
        continue
      }

      if (primitives.length > 0) {
        if (this.colors) {
          Environment.isWindowNotDefined && print.push(getLoggerANSIColor(level))
        }

        print.push(primitives.join(this.separator))
        primitives = []

        if (this.colors) {
          Environment.isWindowNotDefined && print.push(ANSIColor.RESET)
        }
      }

      if (Environment.isFormDataDefined && arg instanceof FormData) {
        print.push(deserializeFormData(arg))
        continue
      }

      print.push(arg)
    }

    if (primitives.length > 0) {
      if (this.colors) {
        Environment.isWindowNotDefined && print.push(getLoggerANSIColor(level))
      }

      print.push(primitives.join(this.separator))
    }

    return print
  }

  static getLevelFromEnvironment(name: string): LoggerLevel | undefined {
    let value: string

    value = Environment.get(`LOGGER_${name}_LEVEL`)
    if (!LOGGER_LEVELS.includes(value as LoggerLevel)) return

    return value as LoggerLevel
  }

  static getStatusFromEnvironment(name: string): LoggerStatus | undefined {
    let value: string

    value = Environment.get(`LOGGER_${name}_STATUS`)
    if (!LOGGER_STATUSES.includes(value as LoggerStatus)) return

    return value as LoggerStatus
  }

  get isDisabled(): boolean {
    return this.status === 'off'
  }

  get isEnabled(): boolean {
    return this.status === 'on'
  }

  get isLevelVerboseDisabled(): boolean {
    return ['debug', 'info', 'warn', 'error'].includes(this.level)
  }

  get isLevelDebugDisabled(): boolean {
    return ['info', 'warn', 'error'].includes(this.level)
  }

  get isLevelInfoDisabled(): boolean {
    return ['warn', 'error'].includes(this.level)
  }

  get isLevelWarnDisabled(): boolean {
    return ['error'].includes(this.level)
  }
}
