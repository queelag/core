import { LoggerName } from '../definitions/enums.js'
import { Logger } from '../modules/logger.js'

export const ModuleLogger: Logger = new Logger(LoggerName.MODULE)
