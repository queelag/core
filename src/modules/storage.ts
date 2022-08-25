import { StorageTarget, StorageValue } from '../definitions/interfaces'
import { KeyOf } from '../definitions/types'
import { tcp } from '../functions/tcp'
import { ModuleLogger } from '../loggers/module.logger'
import { copyObjectProperty, deleteObjectProperty, hasObjectProperty } from '../utils/object.utils'

/**
 * A module to handle any storage operations through a store.
 *
 * @category Module
 */
export class Storage {
  readonly name: string

  private readonly _clear: () => Promise<void>
  private readonly _get: <T extends StorageValue>(key: string) => Promise<T>
  private readonly _has: (key: string) => Promise<boolean>
  private readonly _remove: (key: string) => Promise<void>
  private readonly _set: <T extends StorageValue>(key: string, value: T) => Promise<void>

  constructor(
    name: string,
    clear: () => Promise<void>,
    get: <T extends StorageValue>(key: string) => Promise<T>,
    has: (key: string) => Promise<boolean>,
    remove: (key: string) => Promise<void>,
    set: <T extends StorageValue>(key: string, value: T) => Promise<void>
  ) {
    this.name = name

    this._clear = clear
    this._get = get
    this._has = has
    this._remove = remove
    this._set = set
  }

  async clear(): Promise<void | Error> {
    let clear: void | Error

    clear = await tcp(() => this._clear())
    if (clear instanceof Error) return clear

    ModuleLogger.debug(this.name, 'get', `The storage has been cleared.`)
  }

  /**
   * Gets an item.
   *
   * @template T The value interface which extends {@link StorageValue}.
   */
  async get<T extends StorageValue>(key: string): Promise<T | Error> {
    let value: T | Error

    value = await tcp(() => this._get(key))
    if (value instanceof Error) return value

    ModuleLogger.debug(this.name, 'get', `The value ${key} has been retrieved.`, value)

    return value
  }

  /**
   * Removes an item, if keys are defined it will only remove those keys of the item.
   *
   * @template T The store interface which extends {@link StorageValue}.
   */
  async remove<T extends StorageValue>(key: string, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let value: T | Error, set: void | Error

    if (typeof keys === 'undefined') {
      let removed: void | Error

      removed = await tcp(() => this._remove(key))
      if (removed instanceof Error) return removed

      ModuleLogger.debug(this.name, 'remove', `The value ${key} has been removed.`)

      return
    }

    value = await tcp(() => this._get(key))
    if (value instanceof Error) return value

    for (let k of keys) {
      deleteObjectProperty(value, k)
      ModuleLogger.debug(this.name, 'remove', `The key ${String(k)} has been removed from the value ${key}.`, keys)
    }

    set = await tcp(() => this._set(key, value))
    if (set instanceof Error) return set

    ModuleLogger.debug(this.name, 'remove', `The value ${key} has been set.`)
  }

  /**
   * Sets an item.
   *
   * @template T The store interface which extends {@link StorageValue}.
   */
  async set<T extends StorageValue>(key: string, value: T, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let set: void | Error

    if (keys) {
      let current: T | Error

      current = await tcp(() => this._get(key))
      if (current instanceof Error) return current

      for (let k of keys) {
        copyObjectProperty(value, k, current)
      }

      return this.set(key, current)
    }

    set = await tcp(() => this._set(key, value))
    if (set instanceof Error) return set

    ModuleLogger.debug(this.name, 'set', `The value ${key} has been set.`, value)
  }

  /**
   * Copies an item to a target.
   *
   * @template T The store interface which extends {@link StorageValue}.
   */
  async copy<T1 extends StorageValue, T2 extends StorageTarget, T extends T1 & T2>(key: string, target: T2, keys?: KeyOf.Deep<T>[]): Promise<void | Error>
  async copy<T1 extends StorageValue, T2 extends StorageTarget, T extends T1 & T2>(key: string, target: T2, keys?: string[]): Promise<void | Error>
  async copy<T1 extends StorageValue, T2 extends StorageTarget, T extends T1 & T2>(key: string, target: T2, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let value: T | Error

    value = await tcp(() => this._get(key))
    if (value instanceof Error) return value

    ModuleLogger.debug(this.name, 'get', `The value ${key} has been retrieved.`, value)

    if (typeof keys === 'undefined') {
      for (let k in value) {
        copyObjectProperty(value, k, target)
      }

      return
    }

    for (let k of keys) {
      copyObjectProperty(value, k, target)
    }
  }

  /**
   * Checks if an item exists, if keys is defined it will also assert that those keys are inside the item.
   */
  async has<T extends StorageValue>(key: string, keys?: KeyOf.Deep<T>[]): Promise<boolean> {
    let has: boolean | Error, value: T | Error

    has = await tcp(() => this._has(key))
    if (has instanceof Error || !has) return false

    if (typeof keys === 'undefined') {
      return true
    }

    value = await tcp(() => this._get(key))
    if (value instanceof Error) return false

    for (let k of keys) {
      if (hasObjectProperty(value, k)) {
        continue
      }

      return false
    }

    return true
  }
}
