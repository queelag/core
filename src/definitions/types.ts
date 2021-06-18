export type ID = string

export type LocalizationPack = {
  data: LocalizationPackData
  language: string
}

export type LocalizationPackData = {
  [key: string]: string | LocalizationPackData
}

export type WithIdentity = {
  id: ID
}
