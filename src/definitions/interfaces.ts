import type { AxiosResponse } from 'axios'
import { ID } from './types'

export interface AnyObject {
  [k: string]: any
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

export interface WithIdentity {
  id: ID
}
