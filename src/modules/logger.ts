import { DEFAULT_LOGGER_SEPARATOR } from '../definitions/constants'
import { ANSIColor, LoggerLevel, LoggerStatus } from '../definitions/enums'
import { deserializeFormData } from '../utils/form.data.utils'
import { Environment } from './environment'

/**
 * A module to print prettier logs.
 *
 * @category Module
 */
export class Logger {
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
    level: LoggerLevel = Logger.getLevelFromEnvironment(name) || (Environment.isProduction ? LoggerLevel.ERROR : LoggerLevel.WARN),
    status: LoggerStatus = Logger.getStatusFromEnvironment(name) || (Environment.isTest ? LoggerStatus.OFF : LoggerStatus.ON),
    separator: string = DEFAULT_LOGGER_SEPARATOR
  ) {
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

    console.debug(...this.format(args, LoggerLevel.VERBOSE))
  }

  /**
   * Logs a debug message to the console.
   */
  debug(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelDebugDisabled) return

    console.debug(...this.format(args, LoggerLevel.DEBUG))
  }

  /**
   * Logs an info message to the console.
   */
  info(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelInfoDisabled) return

    console.info(...this.format(args, LoggerLevel.INFO))
  }

  /**
   * Logs a warn message to the console.
   */
  warn(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelWarnDisabled) return

    console.warn(...this.format(args, LoggerLevel.WARN))
  }

  /**
   * Logs an error message to the console.
   */
  error(...args: any[]): void {
    if (this.isDisabled) return

    console.error(...this.format(args, LoggerLevel.ERROR))
  }

  /**
   * Disables verbose, debug, info, warn and error logs.
   */
  disable(): void {
    this.status = LoggerStatus.OFF
  }

  /**
   * Enables verbose, debug, info, warn and error logs.
   */
  enable(): void {
    this.status = LoggerStatus.ON
  }

  /**
   * Sets the level.
   */
  setLevel(level: LoggerLevel): void {
    this.level = level
  }

  /**
   * Formats the args to be easier to read.
   */
  format(...args: any[]): any[] {
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
        Environment.isWindowNotDefined && print.push(this.ANSIColorByLevel)

        print.push(primitives.join(this.separator))
        primitives = []

        Environment.isWindowNotDefined && print.push(ANSIColor.RESET)
      }

      if (Environment.isFormDataDefined && arg instanceof FormData) {
        print.push(deserializeFormData(arg))
        continue
      }

      print.push(arg)
    }

    if (primitives.length > 0) {
      Environment.isWindowNotDefined && print.push(this.ANSIColorByLevel)
      print.push(primitives.join(this.separator))
    }

    return print
  }

  static getLevelFromEnvironment(name: string): LoggerLevel | undefined {
    let value: string

    value = Environment.get(`LOGGER_${name}_LEVEL`)
    if (!Object.keys(LoggerLevel).includes(value)) return

    return value as LoggerLevel
  }

  static getStatusFromEnvironment(name: string): LoggerStatus | undefined {
    let value: string

    value = Environment.get(`LOGGER_${name}_STATUS`)
    if (!Object.keys(LoggerStatus).includes(value)) return

    return value as LoggerStatus
  }

  /** @internal */
  private get ANSIColorByLevel(): string {
    switch (this.level) {
      case LoggerLevel.DEBUG:
        return ANSIColor.MAGENTA
      case LoggerLevel.ERROR:
        return ANSIColor.RED
      case LoggerLevel.INFO:
        return ANSIColor.BLUE
      case LoggerLevel.VERBOSE:
        return ANSIColor.WHITE
      case LoggerLevel.WARN:
        return ANSIColor.YELLOW
    }
  }

  get isDisabled(): boolean {
    return this.status === LoggerStatus.OFF
  }

  get isEnabled(): boolean {
    return this.status === LoggerStatus.ON
  }

  get isLevelVerboseDisabled(): boolean {
    return [LoggerLevel.DEBUG, LoggerLevel.INFO, LoggerLevel.WARN, LoggerLevel.ERROR].includes(this.level)
  }

  get isLevelDebugDisabled(): boolean {
    return [LoggerLevel.INFO, LoggerLevel.WARN, LoggerLevel.ERROR].includes(this.level)
  }

  get isLevelInfoDisabled(): boolean {
    return [LoggerLevel.WARN, LoggerLevel.ERROR].includes(this.level)
  }

  get isLevelWarnDisabled(): boolean {
    return [LoggerLevel.ERROR].includes(this.level)
  }
}
