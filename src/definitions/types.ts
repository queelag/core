export type ID = string

export interface LocalizationPack {
  data: LocalizationPackData
  language: string
}

export interface LocalizationPackData {
  [key: string]: string | LocalizationPackData
}

export type StatusTransformer = (keys: string[]) => string

export interface StringObject {
  [k: string]: string
}

export interface WithIdentity {
  id: ID
}
