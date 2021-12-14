import { AnyObject } from '../definitions/interfaces'
import { ModuleLogger } from '../loggers/module.logger'
import { tcp } from './tcp'

/**
 * A module to handle any storage operations through a store.
 *
 * @category Module
 */
export class Storage {
  name: string

  constructor(
    name: string,
    get: <T extends AnyObject>(key: string) => Promise<T>,
    remove: (key: string) => Promise<void>,
    set: (key: string, value: string) => Promise<void>
  ) {
    this.name = name

    this._get = get
    this._remove = remove
    this._set = set
  }

  /**
   * Sets a value for each key in keys from the local storage.
   *
   * @template T The store interface which extends {@link AnyObject}.
   */
  async get<T extends AnyObject>(key: string): Promise<T | Error>
  async get<T extends AnyObject, U extends keyof T>(name: string, store: T, keys?: U[]): Promise<Pick<T, U> | Error>
  async get<T extends AnyObject>(...args: any[]): Promise<T | Error> {
    let name: string, store: T, keys: (keyof T)[], item: T | Error, value: string

    name = args[0]
    store = args[1] || {}
    keys = args[2] || Object.keys(store)

    item = await tcp(async () => this._get(name))
    if (item instanceof Error) return item

    ModuleLogger.debug(this.name, 'get', `The item has been parsed as JSON.`, item)

    keys.forEach((k: keyof T) => {
      value = (item as T)[k]
      if (!Object.keys(item).includes(k.toString())) return ModuleLogger.error(this.name, 'get', `The JSON does not contain the key ${k}.`, item)

      store[k] = value as any
      ModuleLogger.debug(this.name, 'get', `The key ${k} has been set.`, value)
    })

    return item
  }

  /**
   * Removes each key in keys.
   *
   * @template T The store interface which extends {@link AnyObject}.
   */
  async remove<T extends AnyObject>(key: string): Promise<void | Error>
  async remove<T extends AnyObject>(name: string, store: T, keys?: (keyof T)[]): Promise<void | Error>
  async remove<T extends AnyObject>(...args: any[]): Promise<void | Error> {
    let name: string, store: T, keys: (keyof T)[], item: AnyObject | Error, set: void | Error

    name = args[0]
    store = args[1] || {}
    keys = args[2] || Object.keys(store)

    if (keys.length === Object.keys(store).length) {
      let removed: void | Error

      removed = await tcp(() => this._remove(name))
      if (removed instanceof Error) return removed

      return
    }

    item = await tcp(async () => this._get(name))
    if (item instanceof Error) return item

    ModuleLogger.debug(this.name, 'remove', `The item has been parsed as JSON.`, item)

    keys.forEach((k: keyof T) => {
      delete store[k]
      ModuleLogger.debug(this.name, 'remove', `The key ${k} has been removed.`)
    })

    set = await tcp(() => this._set(name, JSON.stringify(item)))
    if (set instanceof Error) return set

    return
  }

  /**
   * Sets a stringified JSON for each key in keys.
   *
   * @template T The store interface which extends {@link AnyObject}.
   */
  async set<T extends AnyObject>(key: string): Promise<void | Error>
  async set<T extends AnyObject>(name: string, store: T, keys?: (keyof T)[]): Promise<void | Error>
  async set<T extends AnyObject>(...args: any[]): Promise<void | Error> {
    let name: string, store: T, keys: (keyof T)[], item: T | Error, set: void | Error

    name = args[0]
    store = args[1] || {}
    keys = args[2] || Object.keys(store)

    item = await tcp(async () => this._get(name))
    if (item instanceof Error) return item

    keys.forEach((k: keyof T) => {
      ;(item as T)[k] = store[k]
      ModuleLogger.debug(this.name, 'set', `The key ${k} has been set.`, store[k])
    })

    set = await tcp(() => this._set(name, JSON.stringify(item)))
    if (set instanceof Error) return set

    return
  }

  /** @hidden */
  private async _get<T extends AnyObject>(key: string): Promise<T> {
    return {} as T
  }

  /** @hidden */
  private async _remove(key: string): Promise<void> {}

  /** @hidden */
  private async _set(key: string, value: string): Promise<void> {}
}
