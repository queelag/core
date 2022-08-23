import { LoggerName } from '../definitions/enums'
import { Logger } from '../modules/logger'

export const UtilLogger: Logger = new Logger(LoggerName.UTIL)
