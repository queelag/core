import { StorageName } from '../definitions/enums'
import { LocalizationPack } from '../definitions/interfaces'
import { Logger } from '../modules/logger'
import { ObjectUtils } from '../utils/object.utils'
import { Environment } from './environment'
import { LocalStorage } from './local.storage'
import { Storage } from './storage'

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
class _ {
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
    this.language = Environment.isWindowDefined ? window.navigator.language.slice(0, 2) : 'en'
    this.packs = []
    this.storage = LocalStorage
  }

  async initialize(): Promise<boolean> {
    return this.storage.get(StorageName.LOCALIZATION, this, ['language'])
  }

  async setLanguage(language: string): Promise<boolean> {
    this.language = language
    Logger.debug('Localization', 'setLanguage', `The language has been set to ${this.language}.`)

    return this.storage.set(StorageName.LOCALIZATION, this, ['language'])
  }

  /**
   * Adds n {@link LocalizationPack} to the {@link Localization.data}.
   */
  add(...packs: LocalizationPack[]): void {
    packs.forEach((v: LocalizationPack) => {
      let potential: LocalizationPack

      potential = this.findPackByLanguage(v.language)
      if (potential.language) {
        potential.data = Object.assign({}, potential.data, v.data)
        Logger.debug('Localization', 'add', `The pack data has been merged for the language ${v.language}.`, [potential.data])

        return
      }

      this.packs.push(v)
      Logger.debug('Localization', 'add', `The pack for the language ${v.language} has been pushed.`, [v])
    })
  }

  /**
   * Returns a string localized to the current {@link Localization.language}.
   */
  get<T extends object>(path: string, inject: T = {} as T): string {
    let localized: string, matches: RegExpMatchArray | null

    localized = ObjectUtils.get(this.pack.data, path, path)
    if (localized === path) return localized

    matches = localized.match(/@([a-zA-Z_]+|->|)+[a-zA-Z]/gm)
    if (!matches) return localized

    return matches
      .sort((a: string, b: string) => b.length - a.length)
      .reduce((r: string, v: string) => r.replace(v, ObjectUtils.get(inject, v.slice(1).replace(/->/gm, '.'), v)), localized)
  }

  /**
   * Checks whether a path is localizable or not.
   */
  has(path: string): boolean {
    return ObjectUtils.has(this.pack.data, path)
  }

  findPackByLanguage(language: string): LocalizationPack {
    return this.packs.find((v: LocalizationPack) => v.language === language) || { data: {}, language: '' }
  }

  get pack(): LocalizationPack {
    return this.findPackByLanguage(this.language)
  }
}

export const Localization = new _()
