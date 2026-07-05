export enum AnsiColor {
  Black = '\x1b[30m',
  Blue = '\x1b[34m',
  Cyan = '\x1b[36m',
  Green = '\x1b[32m',
  Magenta = '\x1b[35m',
  Red = '\x1b[31m',
  Reset = '\x1b[0m',
  White = '\x1b[37m',
  Yellow = '\x1b[33m'
}

export enum LoggerName {
  Class = 'CORE_CLASS',
  Function = 'CORE_FUNCTION',
  Util = 'CORE_UTIL'
}

export enum StorageName {
  Memory = 'CORE_MEMORY'
}
