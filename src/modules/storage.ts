import { AnyObject } from '../definitions/interfaces'
import { Logger } from './logger'
import { tcp } from './tcp'

/**
 * A module to handle any storage operations through a store.
 *
 * @category Module
 */
export class Storage {
  engine: string

  constructor(
    engine: string,
    get: (key: string) => Promise<null | string>,
    remove: (key: string) => Promise<void>,
    set: (key: string, value: string) => Promise<void>
  ) {
    this.engine = engine

    this._get = get
    this._remove = remove
    this._set = set
  }

  /**
   * Sets a value for each key in keys from the local storage.
   *
   * @template T The store interface which extends {@link AnyObject}.
   */
  async get<T extends AnyObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store), all: boolean = false): Promise<boolean> {
    let item: T | Error, value: string

    item = await tcp(async () => JSON.parse((await this._get(name)) || '{}'))
    if (item instanceof Error) return false

    Logger.debug(this.engine, 'get', `The item has been parsed as JSON.`, item)

    if (all) {
      Object.entries(item).forEach((v: [string, any]) => {
        store[v[0] as keyof T] = v[1]
        Logger.debug(this.engine, 'get', `The key ${v[0]} has been set.`, v[1])
      })
    } else {
      keys.forEach((k: keyof T) => {
        value = (item as T)[k]
        if (!Object.keys(item).includes(k.toString())) return Logger.error(this.engine, 'get', `The JSON does not contain the key ${k}.`, item)

        store[k] = value as any
        Logger.debug(this.engine, 'get', `The key ${k} has been set.`, value)
      })
    }

    return true
  }

  /**
   * Removes each key in keys.
   *
   * @template T The store interface which extends {@link AnyObject}.
   */
  async remove<T extends AnyObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store)): Promise<boolean> {
    if (keys.length === Object.keys(store).length) {
      let removed: void | Error

      removed = await tcp(() => this._remove(name))
      if (removed instanceof Error) return false

      return true
    } else {
      let item: AnyObject | Error, set: void | Error

      item = await tcp(async () => JSON.parse((await this._get(name)) || '{}'))
      if (item instanceof Error) return false

      Logger.debug(this.engine, 'remove', `The item has been parsed as JSON.`, item)

      keys.forEach((k: keyof T) => {
        delete store[k]
        Logger.debug(this.engine, 'remove', `The key ${k} has been removed.`)
      })

      set = await tcp(() => this._set(name, JSON.stringify(item)))
      if (set instanceof Error) return false

      return true
    }
  }

  /**
   * Sets a stringified JSON for each key in keys.
   *
   * @template T The store interface which extends {@link AnyObject}.
   */
  async set<T extends AnyObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store)): Promise<boolean> {
    let item: T | Error, set: void | Error

    item = await tcp(async () => JSON.parse((await this._get(name)) || '{}'))
    if (item instanceof Error) return false

    keys.forEach((k: keyof T) => {
      ;(item as T)[k] = store[k]
      Logger.debug(this.engine, 'set', `The key ${k} has been set.`, store[k])
    })

    set = await tcp(() => this._set(name, JSON.stringify(item)))
    if (set instanceof Error) return false

    return true
  }

  /** @hidden */
  private async _get(key: string): Promise<null | string> {
    return ''
  }

  /** @hidden */
  private async _remove(key: string): Promise<void> {}

  /** @hidden */
  private async _set(key: string, value: string): Promise<void> {}
}
