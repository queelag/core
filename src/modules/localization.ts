import { LocalizationPack, LocalizationPackData } from '../definitions/types'
import { ObjectUtils } from '../utils/object.utils'

class _Localization {
  data: LocalizationPackData
  language: string
  packs: LocalizationPack[]

  constructor() {
    this.data = {}
    this.language = window.navigator.language.slice(0, 2) || 'en'
    this.packs = []
  }

  add(...packs: LocalizationPack[]): void {
    packs.forEach((v: LocalizationPack) => (this.data[v.language] = Object.assign({}, ObjectUtils.get(this.data, v.language, {}), v.data)))
  }

  get(path: string, inject: any[] = ['']): string {
    return inject.reduce(
      (r: string, v: any) => r.replace(this.INJECTION_SYMBOL, ObjectUtils.get(this.data, [this.language, v].join('.'), v)),
      ObjectUtils.get(this.data, [this.language, path].join('.'), typeof path === 'string' ? path : '')
    )
  }

  has(path: string): boolean {
    return ObjectUtils.has(this.data, [this.language, path].join('.'))
  }

  private get INJECTION_SYMBOL(): string {
    return '%%'
  }
}

const Localization = new _Localization()
export { Localization }
