import {
  DEFAULT_LOCALIZATION_STORAGE_KEY,
  REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS,
  SORT_REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS_MATCHES_COMPARE_FN
} from '../definitions/constants.js'
import { LocalizationPack, LocalizationVariables } from '../definitions/interfaces.js'
import { Storage } from '../definitions/types.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { MemoryStorage } from '../storages/memory-storage.js'
import { isNotError } from '../utils/error-utils.js'
import { getObjectProperty, hasObjectProperty, mergeObjects } from '../utils/object-utils.js'

export class Localization {
  language: string
  packs: LocalizationPack[]
  storage: Storage
  storageKey: string
  variables: LocalizationVariables

  constructor(
    language: string,
    packs: LocalizationPack[] = [],
    storage: Storage = MemoryStorage,
    storageKey: string = DEFAULT_LOCALIZATION_STORAGE_KEY,
    variables: LocalizationVariables = {}
  ) {
    this.language = language
    this.packs = packs
    this.storage = storage
    this.storageKey = storageKey
    this.variables = variables
  }

  async initialize(): Promise<boolean> {
    return isNotError(await this.storage.copy(this.storageKey, this, ['language']))
  }

  push(...packs: LocalizationPack[]): void {
    for (let pack of packs) {
      let potential: LocalizationPack

      potential = this.getPackByLanguage(pack.language)

      if (potential.language) {
        potential.data = mergeObjects(potential.data, pack.data)
        ClassLogger.debug('Localization', 'add', `The pack data has been merged for the language ${pack.language}.`, [potential.data])

        continue
      }

      this.packs.push(pack)
      ClassLogger.debug('Localization', 'add', `The pack for the language ${pack.language} has been pushed.`, pack)
    }
  }

  get<T extends object>(path: string, variables?: LocalizationVariables): string
  get<T extends object>(language: string, path: string, variables?: LocalizationVariables): string
  get<T extends object>(...args: any[]): string {
    let language: string, path: string, variables: T, pack: LocalizationPack, localized: string, matches: RegExpMatchArray | null, source: Record<string, any>

    language = typeof args[1] === 'string' ? args[0] : this.language
    path = typeof args[1] === 'string' ? args[1] : args[0]

    variables = typeof args[1] === 'string' ? args[2] : args[1]
    variables = variables || {}

    pack = this.getPackByLanguage(language)
    if (!pack.language) return path

    localized = getObjectProperty(pack.data, path, '')
    if (!localized) return path

    matches = localized.match(REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS)
    if (!matches) return localized

    source = mergeObjects(pack.data, this.variables, variables)
    matches = matches.sort(SORT_REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS_MATCHES_COMPARE_FN)

    for (let match of matches) {
      let key: string, value: string

      key = match.slice(1, -1)
      value = getObjectProperty(source, key, match)

      localized = localized.replace(match, value)
    }

    return localized
  }

  async storeLanguage(): Promise<boolean> {
    return isNotError(await this.storage.set(this.storageKey, this, ['language']))
  }

  setLanguage(language: string): void {
    this.language = language
    ClassLogger.debug('Localization', 'setLanguage', `The language has been set to ${this.language}.`)
  }

  setVariables(variables: LocalizationVariables): void {
    this.variables = variables
    ClassLogger.debug('Localization', 'setVariables', `The variables have been set.`, variables)
  }

  has(path: string): boolean
  has(language: string, path: string): boolean
  has(...args: any[]): boolean {
    let language: string, path: string, pack: LocalizationPack

    language = typeof args[1] === 'string' ? args[0] : this.language
    path = typeof args[1] === 'string' ? args[1] : args[0]

    pack = this.getPackByLanguage(language)
    if (!pack.language) return false

    return hasObjectProperty(pack.data, path)
  }

  getPackByLanguage(language: string): LocalizationPack {
    return this.packs.find((v: LocalizationPack) => v.language === language) || { data: {}, language: '' }
  }
}
