import { LocalizationPack } from '../definitions/interfaces'
import { Logger } from '../modules/logger'
import { ObjectUtils } from '../utils/object.utils'

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
class Localization {
  /**
   * A string which determines the current language.
   */
  static language: string = 'en'
  /**
   * An array of {@link LocalizationPack} objects.
   */
  static packs: LocalizationPack[] = []

  /** @hidden */
  constructor() {}

  /**
   * Adds n {@link LocalizationPack} to the {@link Localization.data}.
   */
  static add(...packs: LocalizationPack[]): void {
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
  static get<T extends object>(path: string, inject: T = {} as T): string {
    let localized: string, matches: RegExpMatchArray | null

    localized = ObjectUtils.get(this.pack.data, path, path, false)
    if (localized === path) return localized

    matches = localized.match(/@[a-zA-Z_.]+/gm)
    if (!matches) return localized

    return matches
      .sort((a: string, b: string) => b.length - a.length)
      .reduce((r: string, v: string) => r.replace(v, ObjectUtils.get(inject, v.slice(1), v, false)), localized)
  }

  /**
   * Checks whether a path is localizable or not.
   */
  static has(path: string): boolean {
    return ObjectUtils.has(this.pack.data, path)
  }

  static findPackByLanguage(language: string): LocalizationPack {
    return this.packs.find((v: LocalizationPack) => v.language === language) || { data: {}, language: '' }
  }

  static get pack(): LocalizationPack {
    return this.findPackByLanguage(this.language)
  }
}

export { Localization }
