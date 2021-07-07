import { LoggerLevel } from '../definitions/enums'

export class Logger {
  static level: LoggerLevel = LoggerLevel.DEBUG
  static status: 'disabled' | 'enabled' = 'enabled'

  static debug(...args: any[]): void {
    this.isEnabled && this.level <= LoggerLevel.DEBUG && console.debug(...this.format(args))
  }

  static info(...args: any[]): void {
    this.isEnabled && this.level <= LoggerLevel.INFO && console.info(...this.format(args))
  }

  static warn(...args: any[]): void {
    this.isEnabled && this.level <= LoggerLevel.WARN && console.warn(...this.format(args))
  }

  static error(...args: any[]): void {
    this.isEnabled && this.level <= LoggerLevel.ERROR && console.error(...this.format(args))
  }

  static disable(): void {
    this.status = 'disabled'
  }

  static enable(): void {
    this.status = 'enabled'
  }

  private static format(args: any[] = []): any[] {
    return [
      args.filter((v: any) => ['boolean', 'number', 'string'].includes(typeof v)).join(' -> '),
      ...args.filter((v: any) => !['boolean', 'number', 'string'].includes(typeof v))
    ]
  }

  private static get isDisabled(): boolean {
    return this.status === 'disabled'
  }

  private static get isEnabled(): boolean {
    return this.status === 'enabled'
  }
}
