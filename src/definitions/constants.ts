import { random } from 'nanoid'
import { ConfigurationFunctions } from './interfaces.js'
import {
  DebounceMapKey,
  DebounceMapValue,
  DeleteObjectPropertiesPredicate,
  GenerateRandomStringRandom,
  HasArrayItemPredicate,
  IntervalMapKey,
  IntervalMapValue,
  LoggerLevel,
  LoggerStatus,
  RemoveArrayItemsPredicate,
  StatusTransformer,
  Theme,
  ThrottleMapKey,
  TimeoutMapKey,
  TimeoutMapValue,
  TypeaheadMapKey,
  TypeaheadMapValue
} from './types.js'

/**
 * Any
 */
/** */
export const EMPTY_OBJECT: () => Record<PropertyKey, any> = () => ({})

/**
 * Appearence
 */
/** */
export const DEFAULT_APPEARENCE_STORAGE_KEY: string = 'aracna_core_appearence'
export const DEFAULT_APPEARENCE_THEME: Theme = 'system'

/**
 * Array Utils
 */
/** */
export const DEFAULT_HAS_ARRAY_ITEM_PREDICATE: HasArrayItemPredicate<any> = (array: any[], item: any) => array.includes(item)
export const DEFAULT_REMOVE_ARRAY_ITEMS_PREDICATE: RemoveArrayItemsPredicate<any> = (array: any[], item: any, items?: any[]) => items?.includes(item) ?? false

/**
 * Configuration
 */
/** */
export const DEFAULT_FUNCTIONS_CONFIGURATION: () => ConfigurationFunctions = () => ({
  tc: {
    log: true,
    onCatch: () => {}
  },
  tcp: {
    log: true,
    onCatch: () => {}
  }
})

/**
 * Cookie
 */
/** */
export const DEFAULT_COOKIE_SEPARATOR: string = '-'

/**
 * Debounce
 */
/** */
export const DEBOUNCE_MAP: Map<DebounceMapKey, DebounceMapValue> = new Map()

/**
 * EventEmitter
 */
/** */
export const DEFAULT_EVENT_EMITTER_MAX_LISTENERS: number = 10

/**
 * History
 */
/** */
export const DEFAULT_HISTORY_SIZE: number = 100

/**
 * Interval
 */
/** */
export const INTERVAL_MAP: Map<IntervalMapKey, IntervalMapValue> = new Map()

/**
 * Localization
 */
/** */
export const DEFAULT_LOCALIZATION_STORAGE_KEY: string = 'aracna_core_localization'
export const REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS: RegExp = /{[^}]{1,256}}/gm
export const SORT_REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS_MATCHES_COMPARE_FN: (a: string, b: string) => number = (a: string, b: string) => b.length - a.length

/**
 * Logger
 */
/** */
export const DEFAULT_LOGGER_SEPARATOR: string = ' -> '
export const LOGGER_LEVELS: LoggerLevel[] = ['debug', 'error', 'info', 'verbose', 'warn']
export const LOGGER_STATUSES: LoggerStatus[] = ['off', 'on']

/**
 * MemoryStorage
 */
/** */
export const MEMORY_STORAGE_MAP: Map<PropertyKey, any> = new Map()

/**
 * Number Utils
 */
/** */
export const REGEXP_FLOAT: RegExp = /^([0-9]{1,64}\.[0-9]{0,64}|[0-9]{0,64}\.[0-9]{1,64})$/
export const REGEXP_INT: RegExp = /^[0-9]{1,64}$/
export const DEFAULT_GET_NUMBER_PERCENTAGE_MAX: number = 100
export const DEFAULT_GET_NUMBER_PERCENTAGE_MIN: number = 0

/**
 * Object Utils
 */
/** */
export const DEFAULT_DELETE_OBJECT_PROPERTIES_PREDICATE: DeleteObjectPropertiesPredicate<any, any> = (_, key: any, __, keys?: any[]) =>
  keys?.includes(key) ?? false
export const DEFAULT_OMIT_OBJECT_PROPERTIES_PREDICATE: DeleteObjectPropertiesPredicate<any, any> = (_, key: any, __, keys?: any[]) =>
  keys?.includes(key) ?? false
export const DEFAULT_PICK_OBJECT_PROPERTIES_PREDICATE: DeleteObjectPropertiesPredicate<any, any> = (_, key: any, __, keys?: any[]) =>
  keys?.includes(key) ?? true
export const REGEXP_LEFT_SQUARE_BRACKET_WITHOUT_LEADING_DOT: RegExp = /([^.])\[/g
export const REGEXP_SQUARE_BRACKETS: RegExp = /[[\]]/g

/**
 * Path Utils
 */
/** */
export const CHAR_BACKWARD_SLASH = 92
export const CHAR_COLON = 58
export const CHAR_DOT = 46
export const CHAR_FORWARD_SLASH = 47
export const CHAR_LOWERCASE_A = 97
export const CHAR_LOWERCASE_Z = 122
export const CHAR_UPPERCASE_A = 65
export const CHAR_UPPERCASE_Z = 90

/**
 * Queue
 */
/** */
export const DEFAULT_QUEUE_CONCURRENCY: number = Infinity
export const DEFAULT_QUEUE_DELAY: number = 0
export const DEFAULT_QUEUE_TIMEOUT: number = 10000

/**
 * Status
 */
/** */
export const DEFAULT_STATUS_TRANSFORMER: StatusTransformer = (keys: string[]) => keys.join('_')

/**
 * String Utils
 */
/** */
export const ALPHABET_LOWERCASE: string = 'abcdefghijklmnopqrstuvwxyz'
export const ALPHABET_NO_LOOK_ALIKES_SAFE: string = '6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz'
export const ALPHABET_NO_LOOK_ALIKES: string = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'
export const ALPHABET_NUMBERS: string = '0123456789'
export const ALPHABET_UPPERCASE: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const ALPHABET_ALPHANUMERIC: string = ALPHABET_NUMBERS + ALPHABET_LOWERCASE + ALPHABET_UPPERCASE
export const ALPHABET_HEX_LOWERCASE: string = ALPHABET_NUMBERS + 'abcdef'
export const ALPHABET_HEX_UPPERCASE: string = ALPHABET_NUMBERS + 'ABCDEF'

export const DEFAULT_GENERATE_RANDOM_STRING_ALPHABET: string = ALPHABET_ALPHANUMERIC
export const DEFAULT_GENERATE_RANDOM_STRING_RANDOM: GenerateRandomStringRandom = random
export const DEFAULT_GENERATE_RANDOM_STRING_SEPARATOR: string = '-'
export const DEFAULT_GENERATE_RANDOM_STRING_SIZE: number = 32

export const REGEXP_NOT_LETTERS_AND_NUMBERS: RegExp = /[^a-zA-Z0-9]/g
export const REGEXP_NOT_LOWERCASE_LETTERS_AND_NUMBERS: RegExp = /[^a-z0-9]/g
export const REGEXP_UPPERCASE_LETTERS: RegExp = /[A-Z]/g

/**
 * Throttle
 */
/** */
export const THROTTLE_MAP: Map<ThrottleMapKey, number> = new Map()

/**
 * Timeout
 */
/** */
export const TIMEOUT_MAP: Map<TimeoutMapKey, TimeoutMapValue> = new Map()

/**
 * Typeahead
 */
/** */
export const DEFAULT_TYPEAHEAD_DEBOUNCE_TIME: number = 100
export const TYPEAHEAD_MAP: Map<TypeaheadMapKey, TypeaheadMapValue> = new Map()

/**
 * wf & wfp
 */
/** */
export const DEFAULT_WF_MS: number = 100
export const DEFAULT_WF_TIMEOUT: number = 10000
export const DEFAULT_WFP_MS: number = DEFAULT_WF_MS
export const DEFAULT_WFP_TIMEOUT: number = DEFAULT_WF_TIMEOUT
