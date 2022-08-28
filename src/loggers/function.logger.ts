import { LoggerName } from '../definitions/enums'
import { Logger } from '../modules/logger'

export const FunctionLogger: Logger = new Logger(LoggerName.FUNCTION)
