import { LoggerName } from '../definitions/enums.js'
import { Logger } from '../modules/logger.js'

export const ClassLogger: Logger = new Logger(LoggerName.CLASS)
