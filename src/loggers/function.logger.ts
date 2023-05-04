import { LoggerName } from '../definitions/enums.js'
import { Logger } from '../modules/logger.js'

export const FunctionLogger: Logger = new Logger(LoggerName.FUNCTION)
