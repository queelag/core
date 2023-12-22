import { DEFAULT_LOGGER_SEPARATOR, LOGGER_LEVELS, LOGGER_STATUSES } from '../definitions/constants.js'
import { ANSIColor } from '../definitions/enums.js'
import { LoggerLevel, LoggerStatus } from '../definitions/types.js'
import { getProcessEnvKey, isFormDataDefined, isNodeEnvProduction, isNodeEnvTest, isWindowNotDefined } from '../utils/environment-utils.js'
import { deserializeFormData } from '../utils/form-data-utils.js'
import { getLoggerANSIColor } from '../utils/logger-utils.js'

/**
 * The Logger class provides an isomorphic and consistent way to log messages to the console.
 *
 * - The level determines which messages are logged, the default level is `warn` on non-production environments and `error` on production environments.
 * - The status determines if the logger is enabled or disabled, the default status is `on` on non-test environments and `off` on test environments.
 * - The colors are on by default on non-browser environments and match the browser console colors.
 * - The separator is a string used to join the arguments passed to the logger methods, the default separator is a ` -> ` symbol.
 */
export class Logger {
  /**
   * The colors are on by default on non-browser environments and match the browser console colors.
   */
  colors: boolean
  /**
   * The level determines which messages are logged, it can be `verbose`, `debug`, `info`, `warn` or `error`.
   */
  level: LoggerLevel
  /**
   * The name is used to get the level and status from the environment variables.
   */
  name: string
  /**
   * The separator is a string used to join the arguments passed to the logger methods.
   */
  separator: string
  /**
   * The status determines if the logger is enabled or disabled.
   */
  status: LoggerStatus

  constructor(
    name: string,
    level: LoggerLevel = Logger.getLevelFromEnvironment(name) ?? (isNodeEnvProduction() ? 'error' : 'warn'),
    status: LoggerStatus = Logger.getStatusFromEnvironment(name) ?? (isNodeEnvTest() ? 'off' : 'on'),
    colors: boolean = isWindowNotDefined(),
    separator: string = DEFAULT_LOGGER_SEPARATOR
  ) {
    this.colors = colors
    this.level = level
    this.name = name
    this.separator = separator
    this.status = status
  }

  /**
   * Logs a message to the console if the logger is enabled and the level is above or equal to `verbose`.
   */
  verbose(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelVerboseDisabled) return

    console.debug(...this.format('verbose', ...args))
  }

  /**
   * Logs a message to the console if the logger is enabled and the level is above or equal to `debug`.
   */
  debug(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelDebugDisabled) return

    console.debug(...this.format('debug', ...args))
  }

  /**
   * Logs a message to the console if the logger is enabled and the level is above or equal to `info`.
   */
  info(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelInfoDisabled) return

    console.info(...this.format('info', ...args))
  }

  /**
   * Logs a message to the console if the logger is enabled and the level is above or equal to `warn`.
   */
  warn(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelWarnDisabled) return

    console.warn(...this.format('warn', ...args))
  }

  /**
   * Logs a message to the console if the logger is enabled and the level is above or equal to `error`.
   */
  error(...args: any[]): void {
    if (this.isDisabled) return

    console.error(...this.format('error', ...args))
  }

  /**
   * Disables the logger.
   */
  disable(): void {
    this.status = 'off'
  }

  /**
   * Enables the logger.
   */
  enable(): void {
    this.status = 'on'
  }

  /**
   * Sets the level of the logger.
   */
  setLevel(level: LoggerLevel): void {
    this.level = level
  }

  /**
   * Sets the separator of the logger.
   */
  setSeparator(separator: string): void {
    this.separator = separator
  }

  /**
   * Disables the colors.
   */
  disableColors(): void {
    this.colors = false
  }

  /**
   * Enables the colors.
   */
  enableColors(): void {
    this.colors = true
  }

  /**
   * Formats the arguments passed to the logger methods, it joins the arguments with the separator and adds the colors if enabled.
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
          print.push(getLoggerANSIColor(level))
        }

        print.push(primitives.join(this.separator))
        primitives = []

        if (this.colors) {
          print.push(ANSIColor.RESET)
        }
      }

      if (isFormDataDefined() && arg instanceof FormData) {
        print.push(deserializeFormData(arg))
        continue
      }

      print.push(arg)
    }

    if (primitives.length > 0) {
      if (this.colors) {
        print.push(getLoggerANSIColor(level))
      }

      print.push(primitives.join(this.separator))

      if (this.colors) {
        print.push(ANSIColor.RESET)
      }
    }

    return print
  }

  /**
   * Gets the level from the environment variables.
   */
  protected static getLevelFromEnvironment(name: string): LoggerLevel | undefined {
    let value: string

    value = getProcessEnvKey(`LOGGER_${name.toUpperCase()}_LEVEL`)
    if (!LOGGER_LEVELS.includes(value as LoggerLevel)) return

    return value as LoggerLevel
  }

  /**
   * Gets the status from the environment variables.
   */
  protected static getStatusFromEnvironment(name: string): LoggerStatus | undefined {
    let value: string

    value = getProcessEnvKey(`LOGGER_${name.toUpperCase()}_STATUS`)
    if (!LOGGER_STATUSES.includes(value as LoggerStatus)) return

    return value as LoggerStatus
  }

  /**
   * Checks if the logger is disabled.
   */
  get isDisabled(): boolean {
    return this.status === 'off'
  }

  /**
   * Checks if the logger is enabled.
   */
  get isEnabled(): boolean {
    return this.status === 'on'
  }

  /**
   * Checks if the verbose level is disabled.
   */
  protected get isLevelVerboseDisabled(): boolean {
    return ['debug', 'info', 'warn', 'error'].includes(this.level)
  }

  /**
   * Checks if the debug level is disabled.
   */
  protected get isLevelDebugDisabled(): boolean {
    return ['info', 'warn', 'error'].includes(this.level)
  }

  /**
   * Checks if the info level is disabled.
   */
  protected get isLevelInfoDisabled(): boolean {
    return ['warn', 'error'].includes(this.level)
  }

  /**
   * Checks if the warn level is disabled.
   */
  protected get isLevelWarnDisabled(): boolean {
    return ['error'].includes(this.level)
  }
}
