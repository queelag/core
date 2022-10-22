import type { FetchResponse } from '../classes/fetch.response'
import type { WriteMode } from './enums'
import { Primitive } from './types'

export interface APIConfig<T = unknown> extends FetchRequestInit<T> {
  query?: object | string
  status?: {
    blacklist?: string[]
    whitelist?: string[]
  }
}

export interface CookieObject extends Record<string, string> {}

export interface CookieSource {
  get: () => string
  set: (string: string) => void
}

export interface CookieItem extends Record<PropertyKey, Primitive> {}

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

export interface DeserializeBlobOptions {
  resolveArrayBuffer?: boolean
  resolveText?: boolean
}

export interface DeserializeFileOptions extends DeserializeBlobOptions {}

export interface FetchRequestInit<T = unknown> extends Omit<RequestInit, 'body'> {
  body?: T
  parse?: boolean
}

export interface FlattenObjectOptions {
  array: boolean
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

export interface IDGenerateOptions {
  alphabet?: string
  blacklist?: string[]
  prefix?: string
  random?: (bytes: number) => Uint8Array
  separator?: string
  size?: number
  suffix?: string
}

export interface LocalizationPack {
  data: LocalizationPackData
  language: string
}

export interface LocalizationPackData {
  [key: string]: string | LocalizationPackData
}

export interface LocalizationVariables extends Record<number | string, any> {}

export interface QueelagBlobJSON {
  id: string
  size: number
  text?: string
  type: string
  uInt8Array: Uint8Array
}

export interface QueelagFileJSON extends QueelagBlobJSON {
  lastModified: number
  name: string
  webkitRelativePath: string
}

export interface StorageItem extends Record<PropertyKey, any> {}
export interface StorageTarget extends Record<PropertyKey, any> {}

export interface WithWriteMode {
  mode?: WriteMode
  isModeCreate?: boolean
  isModeUpdate?: boolean
}
