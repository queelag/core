import { ANSIColor } from '../definitions/enums.js'
import { LoggerLevel } from '../definitions/types.js'

export function getLoggerANSIColor(level: LoggerLevel): string {
  switch (level) {
    case 'debug':
      return ANSIColor.MAGENTA
    case 'error':
      return ANSIColor.RED
    case 'info':
      return ANSIColor.BLUE
    case 'verbose':
      return ANSIColor.WHITE
    case 'warn':
      return ANSIColor.YELLOW
  }
}
