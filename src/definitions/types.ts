import type { AsyncStorage } from '../classes/async-storage.js'
import type { SyncStorage } from '../classes/sync-storage.js'
import type { Typeahead } from '../classes/typeahead.js'
import type { FetchDecodeOptions, FetchEncodeOptions } from './interfaces.js'

export type AppendSearchParamsToURLParams<T extends URLSearchParamsRecord = URLSearchParamsRecord> = DeserializeURLSearchParamsInit<T>

export type DebounceMapKey = bigint | number | string | symbol | Function
export type DebounceMapValue = NodeJS.Timeout | number

export type DeleteObjectPropertiesPredicate<T extends object = object, K extends keyof T | string = keyof T | string> = (
  object: T,
  key: K,
  value: T extends Record<K, infer V> ? V : unknown,
  keys?: PropertyKey[]
) => boolean

export type DeserializeURLSearchParamsInit<T extends URLSearchParamsRecord = URLSearchParamsRecord> = string | string[][] | T | URLSearchParams
export type DeserializeURLSearchParamsType = 'array' | 'object' | 'string'

export type SerializeURLSearchParamsInit<T extends object = object> = string | string[][] | T | URLSearchParams
export type SerializeURLSearchParamsType = 'string' | 'url-search-params'

export type EventEmitterEvents = Record<EventEmitterListenerName, EventEmitterListenerCallback>
export type EventEmitterListenerName = string | symbol
export type EventEmitterListenerCallback = (...args: any[]) => any

export type HasArrayItemPredicate<T> = (array: T[], item: T) => boolean

export type IntervalMapKey = bigint | number | string | symbol | Function
export type IntervalMapValue = NodeJS.Timeout | number

export type IsEqual<T1, T2> = (a: T1, b: T2) => boolean

export type FetchRequestInfo = Request | string
export type FetchRequestInitDecode = boolean | FetchDecodeOptions
export type FetchRequestInitEncode = boolean | FetchEncodeOptions

export type FetchDecodeType = 'array-buffer' | 'blob' | 'form-data' | 'json' | 'text' | 'url-search-params'

export type GenerateRandomStringRandom = (bytes: number) => Uint8Array<ArrayBuffer>

export namespace KeyOf {
  export type Deep<T> = keyof T
  export type DeepArray<T> = keyof T extends number ? keyof T : never
  export type Shallow<T> = keyof T
  export type ShallowArray<T> = keyof T extends number ? keyof T : never
}

export type LoggerLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error'
export type LoggerStatus = 'off' | 'on'

export type JsonEncoding = 'utf-8'

export type OmitObjectPropertiesPredicate<T extends object = object, K extends keyof T | string = keyof T | string> = (
  object: T,
  key: K,
  value: T extends Record<K, infer V> ? V : unknown,
  keys?: PropertyKey[]
) => boolean

export type PickObjectPropertiesPredicate<T extends object = object, K extends keyof T | string = keyof T | string> = (
  object: T,
  key: K,
  value: T extends Record<K, infer V> ? V : unknown,
  keys?: PropertyKey[]
) => boolean

export type Primitive = bigint | boolean | null | number | string | symbol | undefined

export type ProcessEnvValue = string | undefined

export type PromiseState = 'fulfilled' | 'pending' | 'rejected'

export type QueueFunction = () => Promise<unknown>
export type QueueProcessStatus = 'pending' | 'running' | 'fulfilled' | 'rejected' | 'timed-out'
export type QueueStatus = 'running' | 'stopped'

export type RemoveArrayItemsPredicate<T> = (array: T[], item: T, items?: T[]) => boolean

export type RequestMethod = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'

export type StatusTransformer = (keys: string[]) => string

export type Storage = AsyncStorage | SyncStorage

export type Theme = 'dark' | 'light' | 'system'

export type ThrottleMapKey = bigint | number | string | symbol | Function

export type TimeoutMapKey = bigint | number | string | symbol | Function
export type TimeoutMapValue = NodeJS.Timeout | number

export type TypeaheadOnMatch<T> = (item: T) => any
export type TypeaheadMapKey = bigint | number | string | symbol
export type TypeaheadMapValue = Typeahead<any>
export type TypeaheadPredicate<T> = (item: T, query: string, index: number, items: T[]) => unknown

export type VisibilityControllerToggleDelay =
  | number
  | {
      hide?: number
      show?: number
    }

export type URLSearchParamsRecord = Record<string, string>

export type WriteMode = 'create' | 'update'
