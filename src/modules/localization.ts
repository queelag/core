import { StorageName } from '../definitions/enums'
import { LocalizationPack, LocalizationVariables } from '../definitions/interfaces'
import { ModuleLogger } from '../loggers/module.logger'
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

  constructor(language: string, packs: LocalizationPack[], variables: LocalizationVariables = {}, storage: Storage = LocalStorage) {
    this.language = language
    this.packs = packs
    this.storage = storage
    this.variables = variables
  }

  async initialize(): Promise<boolean> {
    let storage: void | Error

    storage = await this.storage.synchronize(StorageName.LOCALIZATION, this, ['language'])
    if (storage instanceof Error) return false

    return true
  }

  async setLanguage(language: string): Promise<boolean> {
    let storage: void | Error

    this.language = language
    ModuleLogger.debug('Localization', 'setLanguage', `The language has been set to ${this.language}.`)

    storage = await this.storage.set(StorageName.LOCALIZATION, this, ['language'])
    if (storage instanceof Error) return false

    return true
  }

  /**
   * Adds n {@link LocalizationPack} to the {@link Localization.data}.
   */
  add(...packs: LocalizationPack[]): void {
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
  get<T extends object>(language: string, path: string, variables: LocalizationVariables): string
  get<T extends object>(...args: any[]): string {
    let language: string, path: string, inject: T, pack: LocalizationPack, localized: string, matches: RegExpMatchArray | null, source: Record<string, any>

    switch (true) {
      case typeof args[0] === 'string' && typeof args[1] === 'string':
        language = args[0]
        path = args[1]
        inject = args[2] || {}

        break
      default:
        language = this.language
        path = args[0]
        inject = args[1] || {}

        break
    }

    pack = this.getPackByLanguage(language)
    if (!pack.language) return path

    localized = getObjectProperty(pack.data, path, '')
    if (!localized) return path

    matches = localized.match(/@([a-zA-Z_]+|->|)+[a-zA-Z]/gm)
    if (!matches) return localized

    source = mergeObjects(pack.data, this.variables, inject)
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
