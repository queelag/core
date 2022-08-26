import type { FetchResponse } from '../classes/fetch.response'
import type { WriteMode } from './enums'
import { Primitive } from './types'

export interface APIConfig<T = void> extends FetchRequestInit<T> {
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

export interface FetchRequestInit<T = void> extends Omit<RequestInit, 'body'> {
  body?: T
  parse?: boolean
}

export interface GraphQLAPIConfig<T = void> extends APIConfig<T> {}

export interface GraphQLAPIRequestBody<T = object> {
  query: string
  variables?: T | null
}

export interface GraphQLAPIResponse<T = any> extends FetchResponse<GraphQLAPIResponseBody<T>> {}

export interface GraphQLAPIResponseBody<T = any> {
  data: T
  errors?: any[]
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

export interface LocalizationVariables extends Record<number | string, string> {}

export interface StorageTarget extends Record<PropertyKey, any> {}
export interface StorageItem extends Record<PropertyKey, any> {}

export interface WithID<T = string> {
  id: T
}

export interface WithWriteMode {
  isModeCreate?: boolean
  isModeUpdate?: boolean
  mode?: WriteMode
}
