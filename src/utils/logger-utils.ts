import { AnsiColor } from '../definitions/enums.js'
import { LoggerLevel } from '../definitions/types.js'

/**
 * Returns the ANSI color code for a logger level, the level can be `debug`, `error`, `info`, `verbose` or `warn`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/logger)
 */
export function getLoggerAnsiColor(level: LoggerLevel): string {
  switch (level) {
    case 'debug':
      return AnsiColor.MAGENTA
    case 'error':
      return AnsiColor.RED
    case 'info':
      return AnsiColor.BLUE
    case 'verbose':
      return AnsiColor.WHITE
    case 'warn':
      return AnsiColor.YELLOW
  }
}
