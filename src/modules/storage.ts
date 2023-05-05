import { StorageItem, StorageTarget } from '../definitions/interfaces.js'
import { KeyOf } from '../definitions/types.js'
import { mtcp } from '../functions/mtcp.js'
import { ModuleLogger } from '../loggers/module-logger.js'
import { copyObjectProperty, deleteObjectProperty, hasObjectProperty } from '../utils/object-utils.js'

/**
 * A module to handle any storage operations through a store.
 *
 * @category Module
 */
export class Storage {
  readonly name: string

  private readonly _clear: () => Promise<void | Error>
  private readonly _get: <T extends StorageItem>(key: string) => Promise<T | Error>
  private readonly _has: (key: string) => Promise<boolean | Error>
  private readonly _remove: (key: string) => Promise<void | Error>
  private readonly _set: <T extends StorageItem>(key: string, item: T) => Promise<void | Error>

  constructor(
    name: string,
    clear: () => Promise<void>,
    get: <T extends StorageItem>(key: string) => Promise<T>,
    has: (key: string) => Promise<boolean>,
    remove: (key: string) => Promise<void>,
    set: <T extends StorageItem>(key: string, item: T) => Promise<void>
  ) {
    this.name = name

    this._clear = mtcp(clear)
    this._get = mtcp(get)
    this._has = mtcp(has)
    this._remove = mtcp(remove)
    this._set = mtcp(set)
  }

  async clear(): Promise<void | Error> {
    let clear: void | Error

    clear = await this._clear()
    if (clear instanceof Error) return clear

    ModuleLogger.debug(this.name, 'get', `The storage has been cleared.`)
  }

  /**
   * Gets an item.
   *
   * @template T The item interface which extends {@link StorageItem}.
   */
  async get<T extends StorageItem>(key: string): Promise<T | Error> {
    let item: T | Error

    item = await this._get(key)
    if (item instanceof Error) return item

    ModuleLogger.debug(this.name, 'get', `The item ${key} has been retrieved.`, item)

    return item
  }

  /**
   * Removes an item, if keys are defined it will only remove those keys of the item.
   *
   * @template T The store interface which extends {@link StorageItem}.
   */
  async remove<T extends StorageItem>(key: string, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let item: T | Error, set: void | Error

    if (typeof keys === 'undefined') {
      let removed: void | Error

      removed = await this._remove(key)
      if (removed instanceof Error) return removed

      ModuleLogger.debug(this.name, 'remove', `The item ${key} has been removed.`)

      return
    }

    item = await this._get(key)
    if (item instanceof Error) return item

    for (let k of keys) {
      deleteObjectProperty(item, k)
      ModuleLogger.debug(this.name, 'remove', `The key ${String(k)} has been removed from the item ${key}.`, keys)
    }

    set = await this._set(key, item)
    if (set instanceof Error) return set

    ModuleLogger.debug(this.name, 'remove', `The item ${key} has been set.`)
  }

  /**
   * Sets an item.
   *
   * @template T The store interface which extends {@link StorageItem}.
   */
  async set<T extends StorageItem>(key: string, item: T, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let set: void | Error

    if (keys) {
      let current: T | Error

      current = await this._get(key)
      if (current instanceof Error) return current

      for (let k of keys) {
        copyObjectProperty(item, k, current)
      }

      return this.set(key, current)
    }

    set = await this._set(key, item)
    if (set instanceof Error) return set

    ModuleLogger.debug(this.name, 'set', `The item ${key} has been set.`, item)
  }

  /**
   * Copies an item to a target.
   *
   * @template T The store interface which extends {@link StorageItem}.
   */
  async copy<T1 extends StorageItem, T2 extends StorageTarget, T extends T1 & T2>(key: string, target: T2, keys?: KeyOf.Deep<T>[]): Promise<void | Error>
  async copy<T1 extends StorageItem, T2 extends StorageTarget, T extends T1 & T2>(key: string, target: T2, keys?: string[]): Promise<void | Error>
  async copy<T1 extends StorageItem, T2 extends StorageTarget, T extends T1 & T2>(key: string, target: T2, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let item: T | Error

    item = await this._get(key)
    if (item instanceof Error) return item

    ModuleLogger.debug(this.name, 'get', `The item ${key} has been retrieved.`, item)

    if (typeof keys === 'undefined') {
      keys = Object.keys(item)
    }

    for (let k of keys) {
      if (!hasObjectProperty(item, k)) {
        continue
      }

      copyObjectProperty(item, k, target)
      ModuleLogger.debug(this.name, 'get', `The ${key} ${String(k)} property has been copied.`, target)
    }
  }

  /**
   * Checks if an item exists, if keys is defined it will also assert that those keys are inside the item.
   */
  async has<T extends StorageItem>(key: string, keys?: KeyOf.Deep<T>[]): Promise<boolean> {
    let has: boolean | Error, item: T | Error

    has = await this._has(key)
    if (has instanceof Error || !has) return false

    if (typeof keys === 'undefined') {
      return true
    }

    item = await this._get(key)
    if (item instanceof Error) return false

    for (let k of keys) {
      if (hasObjectProperty(item, k)) {
        continue
      }

      return false
    }

    return true
  }
}
