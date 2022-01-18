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
  level: LoggerLevel = Environment.isProduction ? LoggerLevel.ERROR : LoggerLevel.DEBUG
  /**
   * A string which determines the name of this ModuleLogger.
   */
  name: string
  /**
   * A {@link BooleanValue}.
   */
  status: BooleanValue = BooleanValue.TRUE

  constructor(
    name: string,
    level: LoggerLevel = Environment.isProduction ? LoggerLevel.ERROR : LoggerLevel.DEBUG,
    status: BooleanValue = Environment.isTest ? BooleanValue.FALSE : BooleanValue.TRUE
  ) {
    this.level = level
    this.name = name
    this.status = status
  }

  /**
   * Logs a verbose message to the console.
   */
  verbose(...args: any[]): void {
    this.isEnabled && this.isLevelLowerThanVerbose && console.debug(...this.format(args, LoggerLevel.VERBOSE))
  }

  /**
   * Logs a debug message to the console.
   */
  debug(...args: any[]): void {
    this.isEnabled && this.isLevelLowerThanDebug && console.debug(...this.format(args, LoggerLevel.DEBUG))
  }

  /**
   * Logs an info message to the console.
   */
  info(...args: any[]): void {
    this.isEnabled && this.isLevelLowerThanInfo && console.info(...this.format(args, LoggerLevel.INFO))
  }

  /**
   * Logs a warn message to the console.
   */
  warn(...args: any[]): void {
    this.isEnabled && this.isLevelLowerThanWarn && console.warn(...this.format(args, LoggerLevel.WARN))
  }

  /**
   * Logs an error message to the console.
   */
  error(...args: any[]): void {
    this.isEnabled && this.isLevelLowerThanError && console.error(...this.format(args, LoggerLevel.ERROR))
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
      ...(Environment.isWindowNotDefined ? [this.findTerminalColorByLevel(level)] : []),
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
  private findTerminalColorByLevel(level: LoggerLevel): string {
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

  get isDisabled(): boolean {
    return this.status === BooleanValue.FALSE
  }

  get isEnabled(): boolean {
    return this.status === BooleanValue.TRUE
  }

  get isLevelLowerThanVerbose(): boolean {
    return this.level <= LoggerLevel.VERBOSE
  }

  get isLevelLowerThanDebug(): boolean {
    return this.level <= LoggerLevel.DEBUG
  }

  get isLevelLowerThanInfo(): boolean {
    return this.level <= LoggerLevel.INFO
  }

  get isLevelLowerThanWarn(): boolean {
    return this.level <= LoggerLevel.WARN
  }

  get isLevelLowerThanError(): boolean {
    return this.level <= LoggerLevel.ERROR
  }
}
