import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { WriteMode } from './enums'
import { ID } from './types'

export interface AnyObject {
  [k: string]: any
}

export interface APIConfig extends AxiosRequestConfig {
  status?: {
    blacklist?: string[]
    whitelist?: string[]
  }
}

export interface ElementTagNameMap extends HTMLElementTagNameMap, Pick<SVGElementTagNameMap, 'svg'> {}

export interface GraphQLAPIAxiosResponse<T = any> extends AxiosResponse<GraphQLAPIResponseBody<T>> {}

export interface GraphQLAPIResponseBody<T = any> {
  data: T
  errors?: any[]
}

export interface LocalizationPack {
  data: LocalizationPackData
  language: string
}

export interface LocalizationPackData {
  [key: string]: string | LocalizationPackData
}

export interface PrimitiveObject {
  [k: string]: boolean | null | number | string | undefined
}

export interface StringObject {
  [k: string]: string
}

export interface Timestamp<T> {
  create: T
  delete: T
  read: T
  update: T
}

export interface WithIdentity {
  id: ID
}

export interface WithTimestamp<T, K extends keyof Timestamp<T>> {
  timestamp: Pick<Timestamp<T>, K>
}

export interface WithWriteMode {
  isModeCreate?: boolean
  isModeUpdate?: boolean
  mode?: WriteMode
}
