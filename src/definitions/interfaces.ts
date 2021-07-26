import type { AxiosResponse } from 'axios'
import { ID } from './types'

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

export interface StringObject {
  [k: string]: string
}

export interface WithIdentity {
  id: ID
}
