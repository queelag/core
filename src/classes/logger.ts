import { DEFAULT_LOGGER_COLORS, DEFAULT_LOGGER_SEPARATOR, LOGGER_LEVELS, LOGGER_STATUSES } from '../definitions/constants.js'
import { ANSIColor } from '../definitions/enums.js'
import { LoggerLevel, LoggerStatus } from '../definitions/types.js'
import { getProcessEnvKey, isFormDataDefined, isNodeEnvProduction, isNodeEnvTest, isWindowNotDefined } from '../utils/environment-utils.js'
import { deserializeFormData } from '../utils/form-data-utils.js'
import { getLoggerANSIColor } from '../utils/logger-utils.js'

export class Logger {
  colors: boolean
  level: LoggerLevel
  name: string
  separator: string
  status: LoggerStatus

  constructor(
    name: string,
    level: LoggerLevel = Logger.getLevelFromEnvironment(name) ?? (isNodeEnvProduction() ? 'error' : 'warn'),
    status: LoggerStatus = Logger.getStatusFromEnvironment(name) ?? (isNodeEnvTest() ? 'off' : 'on'),
    colors: boolean = DEFAULT_LOGGER_COLORS,
    separator: string = DEFAULT_LOGGER_SEPARATOR
  ) {
    this.colors = colors
    this.level = level
    this.name = name
    this.separator = separator
    this.status = status
  }

  verbose(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelVerboseDisabled) return

    console.debug(...this.format('verbose', ...args))
  }

  debug(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelDebugDisabled) return

    console.debug(...this.format('debug', ...args))
  }

  info(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelInfoDisabled) return

    console.info(...this.format('info', ...args))
  }

  warn(...args: any[]): void {
    if (this.isDisabled) return
    if (this.isLevelWarnDisabled) return

    console.warn(...this.format('warn', ...args))
  }

  error(...args: any[]): void {
    if (this.isDisabled) return

    console.error(...this.format('error', ...args))
  }

  disable(): void {
    this.status = 'off'
  }

  enable(): void {
    this.status = 'on'
  }

  setLevel(level: LoggerLevel): void {
    this.level = level
  }

  disableColors(): void {
    this.colors = false
  }

  enableColors(): void {
    this.colors = true
  }

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
          isWindowNotDefined() && print.push(getLoggerANSIColor(level))
        }

        print.push(primitives.join(this.separator))
        primitives = []

        if (this.colors) {
          isWindowNotDefined() && print.push(ANSIColor.RESET)
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
        isWindowNotDefined() && print.push(getLoggerANSIColor(level))
      }

      print.push(primitives.join(this.separator))
    }

    return print
  }

  static getLevelFromEnvironment(name: string): LoggerLevel | undefined {
    let value: string

    value = getProcessEnvKey(`LOGGER_${name.toUpperCase()}_LEVEL`)
    if (!LOGGER_LEVELS.includes(value as LoggerLevel)) return

    return value as LoggerLevel
  }

  static getStatusFromEnvironment(name: string): LoggerStatus | undefined {
    let value: string

    value = getProcessEnvKey(`LOGGER_${name.toUpperCase()}_STATUS`)
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
