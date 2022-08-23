import { StorageName } from '../definitions/enums'
import { LocalizationPack, LocalizationVariables } from '../definitions/interfaces'
import { ModuleLogger } from '../loggers/module.logger'
import { isNotError } from '../utils/error.utils'
import { getObjectProperty, hasObjectProperty, mergeObjects } from '../utils/object.utils'
import { LocalStorage } from './local.storage'
import { Storage } from './storage'

/**
 * A module to handle simple localization.
 *
 * @category Module
 */
export class Localization {
  /**
   * A string which determines the current language.
   */
  language: string
  /**
   * An array of {@link LocalizationPack} objects.
   */
  packs: LocalizationPack[]
  /**
   * A {@link Storage} instance.
   */
  storage: Storage
  /**
   * An object which contains global variables.
   */
  variables: LocalizationVariables

  constructor(language: string, packs: LocalizationPack[] = [], variables: LocalizationVariables = {}, storage: Storage = LocalStorage) {
    this.language = language
    this.packs = packs
    this.storage = storage
    this.variables = variables
  }

  async initialize(): Promise<boolean> {
    return isNotError(await this.storage.synchronize(StorageName.LOCALIZATION, this, ['language']))
  }

  /**
   * Pushes n {@link LocalizationPack} to the {@link Localization.data}.
   */
  push(...packs: LocalizationPack[]): void {
    packs.forEach((v: LocalizationPack) => {
      let potential: LocalizationPack

      potential = this.getPackByLanguage(v.language)
      if (potential.language) {
        potential.data = mergeObjects(potential.data, v.data)
        ModuleLogger.debug('Localization', 'add', `The pack data has been merged for the language ${v.language}.`, [potential.data])

        return
      }

      this.packs.push(v)
      ModuleLogger.debug('Localization', 'add', `The pack for the language ${v.language} has been pushed.`, [v])
    })
  }

  /**
   * Returns a localized string.
   */
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

    matches = localized.match(/@([a-zA-Z_]+|->|)+[a-zA-Z]/gm)
    if (!matches) return localized

    source = mergeObjects(pack.data, this.variables, variables)
    if (Object.keys(source).length <= 0) return localized

    matches
      .sort((a: string, b: string) => b.length - a.length)
      .forEach((v: string) => {
        let key: string, value: string

        key = v.slice(1).replace(/->/gm, '.')
        value = getObjectProperty(source, key, v)

        localized = localized.replace(v, value)
      })

    return localized
  }

  async storeLanguage(language: string): Promise<boolean> {
    this.language = language
    ModuleLogger.debug('Localization', 'storeLanguage', `The language has been set to ${this.language}.`)

    return isNotError(await this.storage.set(StorageName.LOCALIZATION, this, ['language']))
  }

  setLanguage(language: string): void {
    this.language = language
    ModuleLogger.debug('Localization', 'setLanguage', `The language has been set to ${this.language}.`)
  }

  /**
   * Checks whether a path is localizable or not.
   */
  has(path: string): boolean {
    return this.packs.some((v: LocalizationPack) => hasObjectProperty(v.data, path))
  }

  getPackByLanguage(language: string): LocalizationPack {
    return this.packs.find((v: LocalizationPack) => v.language === language) || { data: {}, language: '' }
  }
}
