import { StorageItem, StorageTarget } from '../definitions/interfaces.js'
import { mtc } from '../functions/mtc.js'
import { Storage } from './storage.js'

/**
 * The SyncStorage class is an abstraction to implement any synchronous storage API in an uniform way.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/sync-storage)
 */
export class SyncStorage extends Storage {
  constructor(
    name: string,
    clear: () => void,
    get: <T extends StorageItem>(key: string) => T,
    has: (key: string) => boolean,
    remove: (key: string) => void,
    set: <T extends StorageItem>(key: string, item: T) => void
  ) {
    super(name, mtc(clear), mtc(get), mtc(has), mtc(remove), mtc(set))
  }

  /**
   * Clears the storage, removing all the items.
   */
  clear(): void | Error {
    return super.clear() as void | Error
  }

  /**
   * Retrieves an item from the storage.
   */
  get<T extends StorageItem>(key: string): T | Error {
    return super.get(key) as T | Error
  }

  /**
   * Removes an item from the storage.
   * Optionally you can specify the keys of the item that you want to remove, if you don't specify any key the whole item will be removed.
   */
  remove<T extends StorageItem>(key: string, keys?: (keyof T)[] | undefined): void | Error {
    return super.remove(key, keys) as void | Error
  }

  /**
   * Sets an item in the storage.
   * Optionally you can specify the keys of the item that you want to set, if you don't specify any key the whole item will be set.
   */
  set<T extends StorageItem>(key: string, item: T, keys?: (keyof T)[] | undefined): void | Error {
    return super.set(key, item, keys) as void | Error
  }

  /**
   * Copies an item from the storage to a target object.
   * Optionally you can specify the keys of the item that you want to copy, if you don't specify any key the whole item will be copied.
   */
  copy<T1 extends StorageItem, T2 extends StorageTarget, T extends T1 & T2>(key: string, target: T2, keys?: (keyof T)[] | undefined): void | Error {
    return super.copy(key, target, keys) as void | Error
  }

  /**
   * Checks if an item exists in the storage.
   * Optionally you can specify the keys of the item that you want to check, if you don't specify any key the whole item will be checked.
   */
  has<T extends StorageItem>(key: string, keys?: (keyof T)[] | undefined): boolean {
    return super.has(key, keys) as boolean
  }
}
