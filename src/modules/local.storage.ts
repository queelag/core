import { AnyObject } from '../definitions/interfaces'
import { Logger } from './logger'
import { tc } from './tc'

/**
 * @ignore
 */
export class LocalStorage {
  /** @hidden */
  constructor() {}

  /**
   * Sets a value for each key in keys from the local storage.
   *
   * @template T The store interface which extends {@link AnyObject}
   */
  static get<T extends AnyObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store), all: boolean = false): boolean {
    let item: T | Error, value: string

    item = tc(() => JSON.parse(window.localStorage.getItem(name) || '{}'))
    if (item instanceof Error) return false

    Logger.debug('LocalStorage', 'get', `The item has been parsed as JSON.`, item)

    if (all) {
      Object.entries(item).forEach((v: [string, any]) => {
        store[v[0] as keyof T] = v[1]
        Logger.debug('LocalStorage', 'get', `The key ${v[0]} has been set.`, v[1])
      })
    } else {
      keys.forEach((k: keyof T) => {
        value = (item as T)[k]
        if (!value) return Logger.error('LocalStorage', 'get', `The JSON does not contain the key ${k}.`, item)

        store[k] = value as any
        Logger.debug('LocalStorage', 'get', `The key ${k} has been set.`, value)
      })
    }

    return true
  }

  /**
   * Sets a stringified JSON for each key in keys.
   *
   * @template T The store interface which extends {@link AnyObject}
   */
  static set<T extends AnyObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store)): boolean {
    let item: T | Error, set: void | Error

    item = tc(() => JSON.parse(window.localStorage.getItem(name) || '{}'))
    if (item instanceof Error) return false

    keys.forEach((k: keyof T) => {
      ;(item as T)[k] = store[k]
      Logger.debug('LocalStorage', 'set', `The key ${k} has been set.`, store[k])
    })

    set = tc(() => window.localStorage.setItem(name, JSON.stringify(item)))
    if (set instanceof Error) return false

    return true
  }

  /**
   * Removes each key in keys.
   *
   * @template T The store interface which extends {@link AnyObject}
   */
  static remove<T extends AnyObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store)): boolean {
    if (keys.length === Object.keys(store).length) {
      let removed: void | Error

      removed = tc(() => window.localStorage.removeItem(name))
      if (removed instanceof Error) return false

      return true
    } else {
      let item: AnyObject | Error, set: void | Error

      item = tc(() => JSON.parse(window.localStorage.getItem(name) || '{}'))
      if (item instanceof Error) return false

      Logger.debug('LocalStorage', 'remove', `The item has been parsed as JSON.`, item)

      keys.forEach((k: keyof T) => {
        delete store[k]
        Logger.debug('LocalStorage', 'remove', `The key ${k} has been removed.`)
      })

      set = tc(() => window.localStorage.setItem(name, JSON.stringify(item)))
      if (set instanceof Error) return false

      return true
    }
  }
}
