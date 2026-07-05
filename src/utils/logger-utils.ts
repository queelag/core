import { AnsiColor } from '../definitions/enums.js'
import type { LoggerLevel } from '../definitions/types.js'

/**
 * Returns the ANSI color code for a logger level, the level can be `debug`, `error`, `info`, `verbose` or `warn`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/logger)
 */
export function getLoggerAnsiColor(level: LoggerLevel): string {
  switch (level) {
    case 'debug':
      return AnsiColor.Magenta
    case 'error':
      return AnsiColor.Red
    case 'info':
      return AnsiColor.Blue
    case 'verbose':
      return AnsiColor.White
    case 'warn':
      return AnsiColor.Yellow
    default:
      throw new Error(`Unknown logger level.`)
  }
}
