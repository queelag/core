export enum AnsiColor {
  BLACK = '\x1b[30m',
  BLUE = '\x1b[34m',
  CYAN = '\x1b[36m',
  GREEN = '\x1b[32m',
  MAGENTA = '\x1b[35m',
  RED = '\x1b[31m',
  RESET = '\x1b[0m',
  WHITE = '\x1b[37m',
  YELLOW = '\x1b[33m'
}

export enum LoggerName {
  CLASS = 'CORE_CLASS',
  FUNCTION = 'CORE_FUNCTION',
  UTIL = 'CORE_UTIL'
}

export enum StorageName {
  MEMORY = 'CORE_MEMORY'
}
