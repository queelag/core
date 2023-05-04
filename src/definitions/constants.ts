import { noop } from '../functions/noop.js'
import { ConfigurationModule } from './interfaces.js'
import {
  ArrayIncludes,
  ArrayRemoves,
  DebounceMapKey,
  DebounceMapValue,
  LoggerLevel,
  LoggerStatus,
  StatusTransformer,
  ThrottleMapKey,
  ThrottleMapValue
} from './types.js'

/**
 * Any
 */
export const EMPTY_OBJECT: () => Record<PropertyKey, any> = () => ({})

/**
 * Array Utils
 */
export const DEFAULT_ARRAY_INCLUDES: ArrayIncludes<any> = (array: any[], item: any) => array.includes(item)
export const DEFAULT_ARRAY_REMOVES: ArrayRemoves<any> = (array: any[], item: any) => array.includes(item)

/**
 * Configuration
 */
export const DEFAULT_CONFIGURATION_MODULE: () => ConfigurationModule = () => ({
  tc: {
    log: true,
    onCatch: noop
  },
  tcp: {
    log: true,
    onCatch: noop
  }
})

/**
 * Cookie
 */
export const DEFAULT_COOKIE_SEPARATOR: string = '_'

/**
 * Debounce
 */
export const DEBOUNCE_MAP: Map<DebounceMapKey, DebounceMapValue> = new Map()

/**
 * History
 */
export const DEFAULT_HISTORY_SIZE: number = 100

/**
 * ID
 */
export const ID_ALPHABET_LOWERCASE: string = 'abcdefghijklmnopqrstuvwxyz'
export const ID_ALPHABET_NO_LOOK_ALIKES_SAFE: string = '6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz'
export const ID_ALPHABET_NO_LOOK_ALIKES: string = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'
export const ID_ALPHABET_NUMBERS: string = '0123456789'
export const ID_ALPHABET_UPPERCASE: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const ID_ALPHABET_ALPHANUMERIC: string = ID_ALPHABET_NUMBERS + ID_ALPHABET_LOWERCASE + ID_ALPHABET_UPPERCASE
export const ID_ALPHABET_HEX_LOWERCASE: string = ID_ALPHABET_NUMBERS + 'abcdef'
export const ID_ALPHABET_HEX_UPPERCASE: string = ID_ALPHABET_NUMBERS + 'ABCDEF'

/**
 * Localization
 */
export const REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS: RegExp = /{[^{}]{1,256}}/gm
export const SORT_REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS_MATCHES_COMPARE_FN: (a: string, b: string) => number = (a: string, b: string) => b.length - a.length

/**
 * Logger
 */
export const DEFAULT_LOGGER_COLORS: boolean = true
export const DEFAULT_LOGGER_SEPARATOR: string = ' -> '
export const LOGGER_LEVELS: LoggerLevel[] = ['debug', 'error', 'info', 'verbose', 'warn']
export const LOGGER_STATUSES: LoggerStatus[] = ['off', 'on']

/**
 * Object Utils
 */
export const REGEXP_LEFT_SQUARE_BRACKET_WITHOUT_LEADING_DOT: RegExp = /([^.])\[/g
export const REGEXP_SQUARE_BRACKETS: RegExp = /[\[\]]/g

/**
 * Status
 */
export const DEFAULT_STATUS_TRANSFORMER: StatusTransformer = (keys: string[]) => keys.join('_')

/**
 * String Utils
 */
export const REGEXP_NOT_LETTERS: RegExp = /[^a-zA-Z]/g
export const REGEXP_NOT_LOWERCASE_LETTERS: RegExp = /[^a-z]/g
export const REGEXP_UPPERCASE_LETTERS: RegExp = /[A-Z]/g

/**
 * Throttle
 */
export const THROTTLE_MAP: Map<ThrottleMapKey, ThrottleMapValue> = new Map()

/**
 * URL Utils
 */
export const REGEXP_URL_AMPERSANDS_AFTER_QUESTION_MARKS: RegExp = /\?{1,4}&{1,4}/g
export const REGEXP_URL_ENDING_WITH_QUESTION_MARK: RegExp = /\?$/g
export const REGEXP_URL_MULTIPLE_AMPERSANDS: RegExp = /&{2,4}/g
export const REGEXP_URL_MULTIPLE_QUESTION_MARKS: RegExp = /\?{2,4}/g
export const REGEXP_URL_MULTIPLE_SLASHES: RegExp = /:?\/{2,4}/g
export const REGEXP_URL_QUESTION_MARKS_AFTER_AMPERSANDS: RegExp = /&{1,4}\?{1,4}/g
