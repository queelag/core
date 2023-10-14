import { StorageItem, StorageTarget } from '../definitions/interfaces.js'
import { KeyOf } from '../definitions/types.js'
import { mtcp } from '../functions/mtcp.js'
import { Storage } from './storage.js'

/**
 * @category Module
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

  async clear(): Promise<void | Error> {
    return this.clear_(await this._clear())
  }

  async get<T extends StorageItem>(key: string): Promise<T | Error> {
    return this.get_(key, await this._get(key))
  }

  async remove<T extends StorageItem>(key: string, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let item: T | Error

    if (typeof keys === 'undefined') {
      return this.remove_(key, await this._remove(key))
    }

    item = this.remove__(key, keys, await this._get(key))
    if (item instanceof Error) return item

    return this.remove___(key, item, await this._set(key, item))
  }

  async set<T extends StorageItem>(key: string, item: T, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    let current: T | Error

    if (typeof keys === 'undefined') {
      return this.set_(key, item, await this._set(key, item))
    }

    current = this.set__(item, keys, await this._get(key))
    if (current instanceof Error) return current

    return this.set_(key, item, await this._set(key, current))
  }

  async copy<T1 extends StorageItem, T2 extends StorageTarget, T extends T1 & T2>(key: string, target: T2, keys?: KeyOf.Deep<T>[]): Promise<void | Error> {
    return this.copy_(key, target, keys, await this._get(key))
  }

  async has<T extends StorageItem>(key: string, keys?: KeyOf.Deep<T>[]): Promise<boolean> {
    let has: boolean | Error

    has = await this._has(key)
    if (has instanceof Error || !has) return false

    return this.has_(keys, await this._get(key))
  }
}
