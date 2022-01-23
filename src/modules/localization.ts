import { CoreStorageName } from '../definitions/enums'
import { AnyObject, LocalizationPack } from '../definitions/interfaces'
import { ModuleLogger } from '../loggers/module.logger'
import { ObjectUtils } from '../utils/object.utils'
import { Environment } from './environment'
import { LocalStorage } from './local.storage'
import { Storage } from './storage'

class _ {
  /**
   * An object which contains global injection variables.
   */
  inject: AnyObject
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

  constructor() {
    this.inject = {}
    this.language = Environment.isWindowDefined ? window.navigator.language.slice(0, 2) : 'en'
    this.packs = []
    this.storage = LocalStorage
  }

  async initialize(): Promise<boolean> {
    let storage: Pick<this, 'language'> | Error

    storage = await this.storage.get(CoreStorageName.LOCALIZATION, this, ['language'])
    if (storage instanceof Error) return false

    return true
  }

  async setLanguage(language: string): Promise<boolean> {
    let storage: void | Error

    this.language = language
    ModuleLogger.debug('Localization', 'setLanguage', `The language has been set to ${this.language}.`)

    storage = await this.storage.set(CoreStorageName.LOCALIZATION, this, ['language'])
    if (storage instanceof Error) return false

    return true
  }

  /**
   * Adds n {@link LocalizationPack} to the {@link Localization.data}.
   */
  add(...packs: LocalizationPack[]): void {
    packs.forEach((v: LocalizationPack) => {
      let potential: LocalizationPack

      potential = this.findPackByLanguage(v.language)
      if (potential.language) {
        potential.data = ObjectUtils.merge(potential.data, v.data)
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
  get<T extends object>(path: string, inject?: T): string
  get<T extends object>(language: string, path: string, inject?: T): string
  get<T extends object>(...args: any[]): string {
    let language: string, path: string, inject: T, pack: LocalizationPack, localized: string, matches: RegExpMatchArray | null, source: AnyObject

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

    pack = this.findPackByLanguage(language)
    if (!pack.language) return path

    localized = ObjectUtils.get(pack.data, path, '')
    if (!localized) return path

    matches = localized.match(/@([a-zA-Z_]+|->|)+[a-zA-Z]/gm)
    if (!matches) return localized

    source = ObjectUtils.merge(pack.data, this.inject, inject)
    if (Object.keys(source).length <= 0) return localized

    matches
      .sort((a: string, b: string) => b.length - a.length)
      .forEach((v: string) => {
        let key: string, value: string

        key = v.slice(1).replace(/->/gm, '.')
        value = ObjectUtils.get(source, key, v)

        localized = localized.replace(v, value)
      })

    return localized
  }

  /**
   * Checks whether a path is localizable or not.
   */
  has(path: string): boolean {
    return this.packs.some((v: LocalizationPack) => ObjectUtils.has(v.data, path))
  }

  findPackByLanguage(language: string): LocalizationPack {
    return this.packs.find((v: LocalizationPack) => v.language === language) || { data: {}, language: '' }
  }
}

/**
 * A module to handle simple localization.
 *
 * Usage:
 *
 * ```typescript
 * import { Localization } from '@queelag/core'
 *
 * Localization.add(
 *   { data: { 'message': 'Hello __0!' }, language: 'en' },
 *   { data: { 'message': 'Ciao __0!' }, language: 'it' }
 * )
 *
 * console.log(Localization.get('message'))
 * // logs 'Hello __0!'
 *
 * console.log(Localization.get('message', ['John']))
 * // logs 'Hello John!'
 *
 * Localization.language = 'it'
 * console.log(Localization.get('message', ['John']))
 * // logs 'Ciao John!'
 *
 * console.log(Localization.has('message'))
 * // logs true
 * ```
 *
 * @category Module
 */
export const Localization = new _()
