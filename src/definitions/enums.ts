export enum AnsiColor {
  BLACK = '\x1b[30m',
  RED = '\x1b[31m',
  GREEN = '\x1b[32m',
  YELLOW = '\x1b[33m',
  BLUE = '\x1b[34m',
  MAGENTA = '\x1b[35m',
  CYAN = '\x1b[36m',
  WHITE = '\x1b[37m',
  RESET = '\x1b[0m'
}

export enum LoggerName {
  CLASS = 'CORE_CLASS',
  FUNCTION = 'CORE_FUNCTION',
  UTIL = 'CORE_UTIL'
}

export enum StorageName {
  MEMORY = 'CORE_MEMORY'
}
