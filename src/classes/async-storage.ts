import { StorageItem, StorageTarget } from '../definitions/interfaces.js'
import { KeyOf } from '../definitions/types.js'
import { mtcp } from '../functions/mtcp.js'
import { Storage } from './storage.js'

/**
 * The AsyncStorage class is an abstraction to implement any asynchronous storage API in an uniform way.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/async-storage)
 */
export class AsyncStorage extends Storage {
  constructor(
    name: string,
    clear: () => Promise<void>,
    get: <T extends StorageItem>(key: string) => Promise<T>,
    has: (key: string) => Promise<boolean>,
    remove: (key: string) => Promise<void>,
    set: <T extends StorageItem>(key: string, item: T) => Promise<void>
  ) {
    super(name, mtcp(clear), mtcp(get), mtcp(has), mtcp(remove), mtcp(set))
  }

  /**
   * Clears the storage, removing all the items.
   */
  async clear(): Promise<void | Error> {
    return this.clear_(await this._clear())
  }

  /**
   * Retrieves an item from the storage.
   */
  async get<T extends StorageItem>(key: string): Promise<T | Error> {
    return this.get_(key, await this._get(key))
  }

  /**
   * Removes an item from the storage.
   * Optionally you can specify the keys of the item that you want to remove, if you don't specify any key the whole item will be removed.
   */
  async remove<T extends StorageItem>(key: string, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let item: T | undefined

    if (typeof keys === 'undefined') {
      return this.remove_(key, await this._remove(key))
    }

    item = this.remove__(key, keys, await this._get(key))
    if (typeof item === 'undefined') return item

    return this.remove___(key, item, await this._set(key, item))
  }

  /**
   * Sets an item in the storage.
   * Optionally you can specify the keys of the item that you want to set, if you don't specify any key the whole item will be set.
   */
  async set<T extends StorageItem>(key: string, item: T, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let current: T | Error

    if (typeof keys === 'undefined') {
      return this.set_(key, item, await this._set(key, item))
    }

    current = this.set__(item, keys, await this._get(key))
    if (current instanceof Error) return current

    return this.set_(key, item, await this._set(key, current))
  }

  /**
   * Copies an item from the storage to a target object.
   * Optionally you can specify the keys of the item that you want to copy, if you don't specify any key the whole item will be copied.
   */
  async copy<T1 extends StorageItem, T2 extends StorageTarget = StorageTarget, T extends T1 & T2 = T1 & T2>(
    key: string,
    target: T2,
    keys?: KeyOf.Deep<T>[]
  ): Promise<void | Error> {
    return this.copy_(key, target, keys, await this._get(key))
  }

  /**
   * Checks if an item exists in the storage.
   * Optionally you can specify the keys of the item that you want to check, if you don't specify any key the whole item will be checked.
   */
  async has<T extends StorageItem>(key: string, keys?: KeyOf.Deep<T>[]): Promise<boolean> {
    let has: boolean | Error

    has = await this._has(key)
    if (has instanceof Error || !has) return false

    return this.has_(keys, await this._get(key))
  }
}
