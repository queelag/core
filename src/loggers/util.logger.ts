import { LoggerName } from '../definitions/enums.js'
import { Logger } from '../modules/logger.js'

export const UtilLogger: Logger = new Logger(LoggerName.UTIL)
