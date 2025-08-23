import type { FetchResponse } from '../classes/fetch-response.js'
import type {
  DeserializeURLSearchParamsType,
  EventEmitterEvents,
  FetchDecodeType,
  FetchRequestInitDecode,
  FetchRequestInitEncode,
  JsonEncoding,
  Primitive,
  QueueFunction,
  QueueProcessStatus,
  Storage,
  Theme,
  TypeaheadPredicate,
  WriteMode
} from './types.js'

export interface AppearenceEvents extends EventEmitterEvents {
  'change-theme': (theme: Theme) => any
}

export interface AppearenceInit {
  storage?: {
    instance?: Storage
    key?: string
  }
  theme?: Theme
}

export interface AracnaBlobJSON {
  id: string
  size: number
  type: string
  uInt8Array: Uint8Array
}

export interface AracnaFileJSON extends AracnaBlobJSON {
  lastModified: number
  name: string
  webkitRelativePath: string
}

export interface CloneObjectOptions {
  deep: boolean
}

export interface CookieItem extends Record<PropertyKey, Primitive> {}

export interface CookieObject extends Record<string, string | undefined> {}

export interface CookieSource {
  get: () => string
  set: (string: string) => void
}

export interface CookieTarget extends Record<PropertyKey, Primitive> {}

export interface ConfigurationFunctions {
  tc: {
    log: boolean
    onCatch: <T extends Error>(error: T, log: boolean) => any
  }
  tcp: {
    log: boolean
    onCatch: <T extends Error>(error: T, log: boolean) => any
  }
}

export interface DecodeBase16Options {
  loose?: boolean
  out?: new (size: number) => {
    [index: number]: number
  }
}

export interface DecodeBase32Options extends DecodeBase16Options {}
export interface DecodeBase32HexOptions extends DecodeBase32Options {}
export interface DecodeBase64Options extends DecodeBase16Options {}
export interface DecodeBase64URLOptions extends DecodeBase64Options {}

export interface DecodeJsonOptions {
  castBigIntStringToBigInt?: boolean
  castFloatStringToNumber?: boolean
  castIntStringToNumber?: boolean
  castUnsafeIntToBigInt?: boolean
}

export interface DeleteObjectPropertiesOptions {
  deep: boolean
}

export interface DeserializeBlobOptions {
  resolveArrayBuffer?: boolean
  resolveText?: boolean
}

export interface DeserializeFileOptions extends DeserializeBlobOptions {}

export interface DeserializeFormDataOptions {
  json?: DecodeJsonOptions
}

export interface EncodeBase16Options {
  pad?: boolean
}

export interface EncodeBase32Options extends EncodeBase16Options {}
export interface EncodeBase32HexOptions extends EncodeBase32Options {}
export interface EncodeBase64Options extends EncodeBase16Options {}
export interface EncodeBase64URLOptions extends EncodeBase64Options {}

export interface EncodeJsonOptions<T extends JsonEncoding = 'utf-8'> {
  castBigIntToString?: boolean
  encoding?: T
}

export interface EventEmitterListener<T extends EventEmitterEvents = EventEmitterEvents, K extends keyof T = keyof T> {
  callback: T[K]
  name: K
  options?: EventEmitterListenerOptions
}

export interface EventEmitterListenerOptions {
  once?: boolean
  prepend?: boolean
}

export interface FetchRequestInit<T = unknown> extends Omit<RequestInit, 'body'> {
  body?: T
  decode?: FetchRequestInitDecode
  encode?: FetchRequestInitEncode
  logNativeOptions?: ToLoggableNativeFetchRequestInitOptions
}

export interface FetchDecodeOptions {
  json?: DecodeJsonOptions
  type?: FetchDecodeType
}

export interface FetchEncodeOptions {
  json?: EncodeJsonOptions
}

export interface FlattenObjectOptions {
  array: boolean
}

export interface GenerateRandomStringOptions {
  alphabet?: string
  blacklist?: string[]
  prefix?: string
  random?: (bytes: number) => Uint8Array
  separator?: string
  size?: number
  suffix?: string
}

export interface GetLimitedNumberOptions {
  max?: number
  min?: number
}

export interface GetNumberPercentageOptions {
  max?: number
  min?: number
  round?: boolean
}

export interface GraphQlApiConfig<T = unknown> extends RestApiConfig<T> {}

export interface GraphQlApiRequestBody<T = object> {
  query: string
  variables?: T | null
}

export interface GraphQlApiResponse<T = any> extends FetchResponse<GraphQlApiResponseBody<T>> {}

export interface GraphQlApiResponseBody<T = any> {
  data: T
  errors?: any[]
}

export interface GraphQlApiResponseBodyError<T = any> {
  extensions?: T[]
  locations: GraphQlApiResponseBodyErrorLocation[]
  message: string
}

export interface GraphQlApiResponseBodyErrorLocation {
  column: number
  line: number
}

export interface HistoryDataTarget extends Record<PropertyKey, any> {}

export interface JoinPathsOptions {
  windows?: boolean
}

export interface LocalizationInit<T extends LocalizationVariables = LocalizationVariables> {
  language?: string
  packs?: LocalizationPack[]
  storage?: {
    instance?: Storage
    key?: string
  }
  variables?: T
}

export interface QueueEvents extends EventEmitterEvents {
  'process-fulfill': (process: QueueProcess<any>) => any
  'process-reject': (process: QueueProcess) => any
  'process-run': (process: QueueProcess) => any
  'process-timeout': (process: QueueProcess) => any
}

export interface QueueOptions {
  autostart?: boolean
  concurrency?: number
  delay?: number
  timeout?: number
}

export interface QueueProcess<T = unknown> {
  fn: QueueFunction
  id: string
  reason?: any
  status: QueueProcessStatus
  value?: T
}

export interface SetIntervalOptions {
  autorun?: boolean
}

export interface LocalizationPack {
  data: LocalizationPackData
  language: string
}

export interface LocalizationPackData {
  [key: string]: string | LocalizationPackData
}

export interface LocalizationVariables extends Record<number | string, any> {}

export interface NodeFetch {
  default: any
  Blob: typeof Blob
  File: typeof File
  FormData: typeof FormData
  Headers: typeof Headers
  Request: any
  Response: any
}

export interface OmitObjectPropertiesOptions {
  deep: boolean
}

export interface PickObjectPropertiesOptions {
  deep: boolean
}

export interface RestApiConfig<T = unknown> extends FetchRequestInit<T> {
  query?: object | string
  status?: {
    blacklist?: string[]
    whitelist?: string[]
  }
}

export interface SerializeFormDataOptions {
  json?: EncodeJsonOptions
}

export interface StorageItem extends Record<PropertyKey, any> {}
export interface StorageTarget extends Record<PropertyKey, any> {}

export interface ToLoggableFetchRequestInitOptions {
  deserializeFormData?: DeserializeFormDataOptions
  deserializeURLSearchParamsType?: DeserializeURLSearchParamsType
}

export interface ToLoggableNativeFetchRequestInitOptions extends ToLoggableFetchRequestInitOptions {
  decodeJSON?: DecodeJsonOptions
}

export interface TypeaheadEvents<T> extends EventEmitterEvents {
  match: (item: T) => any
}

export interface TypeaheadOptions<T> {
  debounceTime?: number
  items?: T[]
  listeners?: EventEmitterListener<TypeaheadEvents<T>>[]
  predicate?: TypeaheadPredicate<T>
}

export interface WithWriteMode {
  mode?: WriteMode
  isModeCreate?: boolean
  isModeUpdate?: boolean
}
