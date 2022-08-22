import { LoggerName } from '@/definitions/enums'
import { Logger } from '@/modules/logger'

export const ClassLogger: Logger = new Logger(LoggerName.CLASS)
