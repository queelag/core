export enum ANSIColor {
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

export enum LoggerLevel {
  VERBOSE = 'VERBOSE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export enum LoggerStatus {
  OFF = 'OFF',
  ON = 'ON'
}

export enum LoggerName {
  CLASS = 'CORE_CLASS',
  FUNCTION = 'CORE_FUNCTION',
  MODULE = 'CORE_MODULE',
  UTIL = 'CORE_UTIL'
}

export enum PromiseState {
  FULFILLED = 'FULFILLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export enum RequestMethod {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE'
}

export enum StorageName {
  LOCALIZATION = 'LOCALIZATION'
}

export enum WriteMode {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE'
}
