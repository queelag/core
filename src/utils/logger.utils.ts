import { ANSIColor } from '../definitions/enums'
import { LoggerLevel } from '../definitions/types'

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
