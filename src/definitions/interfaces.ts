import type { FetchResponse } from '../classes/fetch-response.js'
import type { EventEmitterEvents, Primitive, Theme, WriteMode } from './types.js'

export interface APIConfig<T = unknown> extends FetchRequestInit<T> {
  query?: object | string
  status?: {
    blacklist?: string[]
    whitelist?: string[]
  }
}

export interface AppearenceEvents extends EventEmitterEvents {
  'change-theme': (theme: Theme) => any
}

export interface AracnaBlobJSON {
  id: string
  size: number
  text?: string
  type: string
  uInt8Array: Uint8Array
}

export interface AracnaFileJSON extends AracnaBlobJSON {
  lastModified: number
  name: string
  webkitRelativePath: string
}

export interface CookieItem extends Record<PropertyKey, Primitive> {}

export interface CookieObject extends Record<string, string> {}

export interface CookieSource {
  get: () => string
  set: (string: string) => void
}

export interface ConfigurationModule {
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

export interface DeserializeBlobOptions {
  resolveArrayBuffer?: boolean
  resolveText?: boolean
}

export interface DeserializeFileOptions extends DeserializeBlobOptions {}

export interface EncodeBase16Options {
  pad?: boolean
}

export interface EncodeBase32Options extends EncodeBase16Options {}
export interface EncodeBase32HexOptions extends EncodeBase32Options {}
export interface EncodeBase64Options extends EncodeBase16Options {}
export interface EncodeBase64URLOptions extends EncodeBase64Options {}

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
  parse?: boolean
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

export interface GraphQLAPIConfig<T = unknown> extends APIConfig<T> {}

export interface GraphQLAPIRequestBody<T = object> {
  query: string
  variables?: T | null
}

export interface GraphQLAPIResponse<T = any> extends FetchResponse<GraphQLAPIResponseBody<T>> {}

export interface GraphQLAPIResponseBody<T = any> {
  data: T
  errors?: any[]
}

export interface GraphQLAPIResponseBodyError<T = any> {
  extensions?: T[]
  locations: GraphQLAPIResponseBodyErrorLocation[]
  message: string
}

export interface GraphQLAPIResponseBodyErrorLocation {
  column: number
  line: number
}

export interface HistoryDataTarget extends Record<PropertyKey, any> {}

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

export interface StorageItem extends Record<PropertyKey, any> {}
export interface StorageTarget extends Record<PropertyKey, any> {}

export interface WithWriteMode {
  mode?: WriteMode
  isModeCreate?: boolean
  isModeUpdate?: boolean
}
