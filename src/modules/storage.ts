import { StorageTarget, StorageValue } from '../definitions/interfaces'
import { tcp } from '../functions/tcp'
import { ModuleLogger } from '../loggers/module.logger'
import { pickObjectProperties } from '../utils/object.utils'

/**
 * A module to handle any storage operations through a store.
 *
 * @category Module
 */
export class Storage {
  name: string

  constructor(
    name: string,
    get: <T extends StorageValue>(key: string) => Promise<T>,
    remove: (key: string) => Promise<void>,
    set: <T extends StorageValue>(key: string, value: T) => Promise<void>
  ) {
    this.name = name

    this._get = get
    this._remove = remove
    this._set = set
  }

  /**
   * Gets an item.
   *
   * @template T The value interface which extends {@link StorageValue}.
   */
  async get<T extends StorageValue>(key: string): Promise<T | Error> {
    let value: T | Error

    value = await tcp(async () => this._get(key))
    if (value instanceof Error) return value

    ModuleLogger.debug(this.name, 'get', `The value ${key} has been retrieved.`, value)

    return value
  }

  /**
   * Removes an item, if keys are defined it will only remove those keys of the item.
   *
   * @template T The store interface which extends {@link StorageValue}.
   */
  async remove<T extends StorageValue, K extends keyof T = keyof T>(key: string, keys?: K[]): Promise<void | Error> {
    let value: T | Error, set: void | Error

    if (typeof keys === 'undefined') {
      let removed: void | Error

      removed = await tcp(() => this._remove(key))
      if (removed instanceof Error) return removed

      ModuleLogger.debug(this.name, 'remove', `The value ${key} has been removed.`)

      return
    }

    value = await tcp(async () => this._get(key))
    if (value instanceof Error) return value

    for (let k of keys) {
      delete value[k]
      ModuleLogger.debug(this.name, 'remove', `The key ${String(k)} has been removed from the value ${key}.`, keys)
    }

    set = await tcp(() => this._set(key, value))
    if (set instanceof Error) return set

    ModuleLogger.debug(this.name, 'remove', `The value ${key} has been set.`)

    return
  }

  /**
   * Sets an item.
   *
   * @template T The store interface which extends {@link StorageValue}.
   */
  async set<T extends StorageValue, K extends keyof T>(key: string, value: T, keys?: K[]): Promise<void | Error> {
    let picked: Pick<T, K> | Error, set: void | Error

    if (keys) {
      picked = await tcp(async () => this._get(key))
      if (value instanceof Error) return value

      picked = pickObjectProperties(value, keys)
      ModuleLogger.debug(this.name, 'set', `The keys not in keys have been omitted from the value ${key}.`, keys)
    }

    set = await tcp(() => this._set(key, picked || value))
    if (set instanceof Error) return set

    ModuleLogger.debug(this.name, 'set', `The value ${key} has been set.`, value)

    return
  }

  /**
   * Synchronizes an item to a target property.
   *
   * @template T The store interface which extends {@link StorageValue}.
   */
  async synchronize<T extends StorageValue, K extends keyof T, U extends StorageTarget>(key: string, target: U, keys?: K[]): Promise<void | Error> {
    let value: T | Error

    value = await tcp(async () => this._get(key))
    if (value instanceof Error) return value

    ModuleLogger.debug(this.name, 'get', `The value ${key} has been retrieved.`, value)

    if (typeof keys === 'undefined') {
      for (let k in value) {
        target[k] = value[k]
      }

      return
    }

    for (let k of keys) {
      target[k] = value[k]
    }

    return
  }

  /** @hidden */
  private async _get<T extends StorageValue>(key: string): Promise<T> {
    return {} as T
  }

  /** @hidden */
  private async _remove(key: string): Promise<void> {}

  /** @hidden */
  private async _set<T extends StorageValue>(key: string, value: T): Promise<void> {}
}
