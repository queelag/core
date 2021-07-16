import { BooleanValue, LoggerLevel } from '../definitions/enums'

/**
 * A module to print prettier logs
 *
 * Usage:
 *
 * ```typescript
 * import { Logger } from '@queelag/core'
 *
 * Logger.debug('Context', 'method', 'Something happened.')
 * // logs 'Context -> method -> Something happened.'
 * ```
 *
 * @category Module
 */
export class Logger {
  /**
   * A {@link LoggerLevel} which determines the logs that are printed
   */
  static level: LoggerLevel = LoggerLevel.DEBUG
  /**
   * A {@link BooleanValue}
   */
  static status: BooleanValue = BooleanValue.TRUE

  /** @hidden */
  constructor() {}

  /**
   * Logs a debug message to the console
   */
  static debug(...args: any[]): void {
    this.isEnabled && this.level <= LoggerLevel.DEBUG && console.debug(...this.format(args))
  }

  /**
   * Logs an info message to the console
   */
  static info(...args: any[]): void {
    this.isEnabled && this.level <= LoggerLevel.INFO && console.info(...this.format(args))
  }

  /**
   * Logs a warn message to the console
   */
  static warn(...args: any[]): void {
    this.isEnabled && this.level <= LoggerLevel.WARN && console.warn(...this.format(args))
  }

  /**
   * Logs an error message to the console
   */
  static error(...args: any[]): void {
    this.isEnabled && this.level <= LoggerLevel.ERROR && console.error(...this.format(args))
  }

  /**
   * Disables debug, info, warn and error logs
   */
  static disable(): void {
    this.status = BooleanValue.FALSE
  }

  /**
   * Enables debug, info, warn and error logs
   */
  static enable(): void {
    this.status = BooleanValue.TRUE
  }

  /** @internal */
  private static format(args: any[] = []): any[] {
    return [
      args.filter((v: any) => ['boolean', 'number', 'string'].includes(typeof v)).join(' -> '),
      ...args.filter((v: any) => !['boolean', 'number', 'string'].includes(typeof v))
    ]
  }

  /**
   * Checks if logs are disabled
   */
  static get isDisabled(): boolean {
    return this.status === BooleanValue.FALSE
  }

  /**
   * Checks if logs are enabled
   */
  static get isEnabled(): boolean {
    return this.status === BooleanValue.TRUE
  }
}
