import { LocalizationPack, LocalizationPackData } from '../definitions/types'
import { ObjectUtils } from '../utils/object.utils'

class Localization {
  static data: LocalizationPackData = {}
  static language: string = 'en'
  static packs: LocalizationPack[] = []

  static add(...packs: LocalizationPack[]): void {
    packs.forEach((v: LocalizationPack) => (this.data[v.language] = Object.assign({}, ObjectUtils.get(this.data, v.language, {}), v.data)))
  }

  static get(path: string, inject: any[] = ['']): string {
    return inject.reduce(
      (r: string, v: any, k: number) => r.replace(this.INJECTION_SYMBOL + k, ObjectUtils.get(this.data, [this.language, v].join('.'), v)),
      ObjectUtils.get(this.data, [this.language, path].join('.'), typeof path === 'string' ? path : '')
    )
  }

  static has(path: string): boolean {
    return ObjectUtils.has(this.data, [this.language, path].join('.'))
  }

  private static get INJECTION_SYMBOL(): string {
    return '__'
  }
}

export { Localization }
