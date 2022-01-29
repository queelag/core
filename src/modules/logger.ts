import { BooleanValue, LoggerLevel } from '../definitions/enums'
import { FormDataUtils } from '../utils/form.data.utils'
import { Environment } from './environment'

/**
 * A module to print prettier logs.
 *
 * Usage:
 *
 * ```typescript
 * import { Logger, LoggerLevel } from '@queelag/core'
 *
 * const AppLogger = new Logger('App', LoggerLevel.INFO)
 *
 * AppLogger.debug('context', 'method', 'Something happened.')
 * // logs 'context -> method -> Something happened.'
 * ```
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
   * A {@link BooleanValue}.
   */
  status: BooleanValue

  constructor(
    name: string,
    level: LoggerLevel = Logger.getLevelFromEnvironment(name) || (Environment.isProduction ? LoggerLevel.ERROR : LoggerLevel.DEBUG),
    status: BooleanValue = Logger.getStatusFromEnvironment(name) || (Environment.isTest ? BooleanValue.FALSE : BooleanValue.TRUE)
  ) {
    this.level = level
    this.name = name
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
    if (this.isLevelErrorDisabled) return

    console.error(...this.format(args, LoggerLevel.ERROR))
  }

  /**
   * Disables verbose, debug, info, warn and error logs.
   */
  disable(): void {
    this.status = BooleanValue.FALSE
  }

  /**
   * Enables verbose, debug, info, warn and error logs.
   */
  enable(): void {
    this.status = BooleanValue.TRUE
  }

  /** @internal */
  private format(args: any[] = [], level: LoggerLevel): any[] {
    return [
      ...(Environment.isWindowNotDefined ? [this.getTerminalColorByLevel(level)] : []),
      args.filter((v: any) => ['boolean', 'number', 'string'].includes(typeof v) && v.toString().length > 0).join(' -> '),
      ...(Environment.isWindowNotDefined ? ['\x1b[0m'] : []),
      ...args
        .filter((v: any) => ['bigint', 'function', 'object', 'symbol', 'undefined'].includes(typeof v))
        .map((v: any) => {
          switch (true) {
            case Environment.isFormDataDefined && v instanceof FormData:
              return FormDataUtils.toObject(v)
            default:
              return v
          }
        })
    ]
  }

  /** @internal */
  private getTerminalColorByLevel(level: LoggerLevel): string {
    switch (level) {
      case LoggerLevel.DEBUG:
        return '\x1b[34m'
      case LoggerLevel.ERROR:
        return '\x1b[31m'
      case LoggerLevel.INFO:
        return '\x1b[37m'
      case LoggerLevel.VERBOSE:
        return '\x1b[34m'
      case LoggerLevel.WARN:
        return '\x1b[33m'
    }
  }

  static getLevelFromEnvironment(name: string): LoggerLevel | undefined {
    let value: string

    value = Environment.get(`LOGGER_${name}_LEVEL`)
    if (!Object.keys(LoggerLevel).includes(value)) return

    return value as LoggerLevel
  }

  static getStatusFromEnvironment(name: string): BooleanValue | undefined {
    let value: string

    value = Environment.get(`LOGGER_${name}_STATUS`)
    if (!Object.keys(BooleanValue).includes(value)) return

    return value as BooleanValue
  }

  get isDisabled(): boolean {
    return this.status === BooleanValue.FALSE
  }

  get isEnabled(): boolean {
    return this.status === BooleanValue.TRUE
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

  get isLevelErrorDisabled(): boolean {
    return false
  }
}
