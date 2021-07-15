import { LocalizationPack, LocalizationPackData } from '../definitions/types'
import { ObjectUtils } from '../utils/object.utils'

/**
 * A module to handle simple localization
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
   * A {@link LocalizationPackData} object
   */
  static data: LocalizationPackData = {}
  /**
   * A string which determines the current language
   */
  static language: string = 'en'

  /** @hidden */
  constructor() {}

  /**
   * Adds n {@link LocalizationPack} to the {@link Localization.data}
   *
   * @param packs An array of {@link LocalizationPack}
   */
  static add(...packs: LocalizationPack[]): void {
    packs.forEach((v: LocalizationPack) => (this.data[v.language] = Object.assign({}, ObjectUtils.get(this.data, v.language, {}), v.data)))
  }

  /**
   * Returns a string localized to the current {@link Localizaton.language}
   *
   * @param path A string which supports the dot notation
   * @param inject An array of values that will get injected into the string
   * @returns A string localized to the current {@link Localizaton.language}
   */
  static get(path: string, inject: any[] = ['']): string {
    return inject.reduce(
      (r: string, v: any, k: number) => r.replace(this.INJECTION_SYMBOL + k, ObjectUtils.get(this.data, [this.language, v].join('.'), v)),
      ObjectUtils.get(this.data, [this.language, path].join('.'), typeof path === 'string' ? path : '')
    )
  }

  /**
   * Checks whether a path is localizable or not
   *
   * @param path A string which supports the dot notation
   * @returns A boolean value
   */
  static has(path: string): boolean {
    return ObjectUtils.has(this.data, [this.language, path].join('.'))
  }

  /** @internal */
  private static get INJECTION_SYMBOL(): string {
    return '__'
  }
}

export { Localization }
