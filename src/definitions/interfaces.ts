import { ID } from './types'

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
