import { Logger } from './logger'
import { tc } from './tc'

export class Storage<T extends object> {
  name: string
  keys: (keyof T)[]
  store: T

  constructor(name: string, keys: (keyof T)[], store: T) {
    this.name = name
    this.keys = keys
    this.store = store
  }

  async load(): Promise<boolean> {
    let parsed: object

    parsed = tc(() => JSON.parse(window.localStorage.getItem(this.name) || '{}'))
    if (parsed instanceof Error) return false

    Logger.debug('Storage', this.name, 'load', `The item has been parsed.`, parsed)

    Object.entries(parsed).forEach((v: [string, any]) => {
      this.store[v[0] as keyof T] = v[1]
      Logger.debug('Storage', this.name, 'load', `The key ${v[0]} has been set with the value below.`, v[1])
    })

    return true
  }

  async save(): Promise<boolean> {
    let stringified: string | Error

    stringified = tc(() => JSON.stringify(this.keys.reduce((r: object, k: keyof T) => ({ ...r, [k]: this.store[k] }), {})))
    if (stringified instanceof Error) return false

    window.localStorage.setItem(this.name, stringified)
    Logger.debug('Storage', this.name, 'save', `The item has been set.`)

    return true
  }

  async remove(): Promise<void> {
    window.localStorage.removeItem(this.name)
    Logger.debug('Storage', this.name, 'remove', `The item has been removed.`)
  }
}
