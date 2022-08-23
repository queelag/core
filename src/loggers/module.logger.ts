import { LoggerName } from '../definitions/enums'
import { Logger } from '../modules/logger'

export const ModuleLogger: Logger = new Logger(LoggerName.MODULE)
