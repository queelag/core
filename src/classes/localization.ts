import {
  DEFAULT_LOCALIZATION_STORAGE_KEY,
  REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS,
  SORT_REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS_MATCHES_COMPARE_FN
} from '../definitions/constants.js'
import { LocalizationInit, LocalizationPack, LocalizationVariables } from '../definitions/interfaces.js'
import { Storage } from '../definitions/types.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { MemoryStorage } from '../storages/memory-storage.js'
import { isNotError } from '../utils/error-utils.js'
import { getObjectProperty, hasObjectProperty, mergeObjects } from '../utils/object-utils.js'

/**
 * The Localization class is used to localize anything that can be localized.
 *
 * - The language will persist in the storage, by default it will be stored in memory.
 * - The path of the localized string supports dot notation, for example: 'path.to.the.value'.
 * - The variables support dot notation as well and can be used inside the localized string, for example: 'Hello {name}!'.
 * - The instance also supports default variables, which can be overridden by the variables passed to the get method.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/localization)
 */
export class Localization {
  /**
   * The language that will be used to localize.
   */
  language: string
  /**
   * The packs that will be used to localize.
   */
  packs: LocalizationPack[]
  /**
   * The storage that will be used to store the language.
   */
  storage: Storage
  /**
   * The key that will be used to store the language.
   */
  storageKey: string
  /**
   * The default variables that will be used to localize.
   */
  variables: LocalizationVariables

  constructor(init?: LocalizationInit) {
    this.language = init?.language ?? ''
    this.packs = init?.packs ?? []
    this.storage = init?.storage?.instance ?? MemoryStorage
    this.storageKey = init?.storage?.key ?? DEFAULT_LOCALIZATION_STORAGE_KEY
    this.variables = init?.variables ?? {}
  }

  /**
   * Retrieves the language from the storage and sets it.
   */
  async initialize(): Promise<boolean> {
    return isNotError(await this.storage.copy(this.storageKey, this, ['language']))
  }

  /**
   * Stores the language in the storage.
   */
  async store(): Promise<boolean> {
    return isNotError(await this.storage.set(this.storageKey, this, ['language']))
  }

  /**
   * Adds the packs to the instance, if a pack for the language already exists, the data will be merged.
   */
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

  /**
   * Retrieves the localized string from the pack.
   * Optionally you can pass variables that will be used to replace the variables inside the localized string.
   */
  get<T extends object>(path: string, variables?: LocalizationVariables): string
  get<T extends object>(language: string, path: string, variables?: LocalizationVariables): string
  get<T extends object>(...args: any[]): string {
    let language: string, path: string, variables: T, pack: LocalizationPack, localized: string, matches: RegExpMatchArray | null, source: Record<string, any>

    language = typeof args[1] === 'string' ? args[0] : this.language
    path = typeof args[1] === 'string' ? args[1] : args[0]

    variables = typeof args[1] === 'string' ? args[2] : args[1]
    variables = variables ?? {}

    pack = this.getPackByLanguage(language)
    if (!pack.language) return path

    localized = getObjectProperty(pack.data, path, '')
    if (!localized) return path

    REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS.lastIndex = 0

    matches = REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS.exec(localized)
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

  /**
   * Sets the language.
   */
  setLanguage(language: string): void {
    this.language = language
    ClassLogger.debug('Localization', 'setLanguage', `The language has been set to ${this.language}.`)
  }

  /**
   * Sets the default variables.
   */
  setVariables(variables: LocalizationVariables): void {
    this.variables = variables
    ClassLogger.debug('Localization', 'setVariables', `The variables have been set.`, variables)
  }

  /**
   * Checks if the pack has the path.
   */
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

  /**
   * Retrieves the pack by the language.
   */
  getPackByLanguage(language: string): LocalizationPack {
    return this.packs.find((v: LocalizationPack) => v.language === language) ?? { data: {}, language: '' }
  }
}
