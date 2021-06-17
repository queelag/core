export type ID = string
export type OptionalID = string | undefined

export type LocalizationPack = {
  data: LocalizationPackData
  language: string
}

export type LocalizationPackData = {
  [key: string]: string | LocalizationPackData
}
