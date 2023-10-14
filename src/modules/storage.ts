import { StorageItem, StorageTarget } from '../definitions/interfaces.js'
import { KeyOf } from '../definitions/types.js'
import { ModuleLogger } from '../loggers/module-logger.js'
import { copyObjectProperty, deleteObjectProperty, hasObjectProperty } from '../utils/object-utils.js'

/**
 * @category Module
 */
export class Storage {
  readonly name: string

  protected readonly _clear: () => void | Error | Promise<void | Error>
  protected readonly _get: <T extends StorageItem>(key: string) => T | Error | Promise<T | Error>
  protected readonly _has: (key: string) => boolean | Error | Promise<boolean | Error>
  protected readonly _remove: (key: string) => void | Error | Promise<void | Error>
  protected readonly _set: <T extends StorageItem>(key: string, item: T) => void | Error | Promise<void | Error>

  constructor(
    name: string,
    clear: () => void | Error | Promise<void | Error>,
    get: <T extends StorageItem>(key: string) => T | Error | Promise<T | Error>,
    has: (key: string) => boolean | Error | Promise<boolean | Error>,
    remove: (key: string) => void | Error | Promise<void | Error>,
    set: <T extends StorageItem>(key: string, item: T) => void | Error | Promise<void | Error>
  ) {
    this.name = name

    this._clear = clear
    this._get = get
    this._has = has
    this._remove = remove
    this._set = set
  }

  protected clear_(cleared: void | Error): void | Error {
    if (cleared instanceof Error) return cleared
    ModuleLogger.debug(this.name, 'get', `The storage has been cleared.`)
  }

  clear(): void | Error | Promise<void | Error> {
    return this.clear_(this._clear() as void | Error)
  }

  protected get_<T extends StorageItem>(key: string, item: T | Error): T | Error {
    if (item instanceof Error) return item
    ModuleLogger.debug(this.name, 'get', `The item ${key} has been retrieved.`, item)
    return item
  }

  get<T extends StorageItem>(key: string): T | Error | Promise<T | Error> {
    return this.get_(key, this._get(key) as T | Error)
  }

  protected remove_(key: string, removed: void | Error): void | Error {
    if (removed instanceof Error) return removed
    ModuleLogger.debug(this.name, 'remove', `The item ${key} has been removed.`)
  }

  protected remove__<T extends StorageItem>(key: string, keys: KeyOf.Deep<T>[], item: T | Error): T | Error {
    if (item instanceof Error) return item

    for (let k of keys) {
      deleteObjectProperty(item, k)
      ModuleLogger.debug(this.name, 'remove', `The key ${String(k)} has been removed from the item ${key}.`, keys)
    }

    return item
  }

  protected remove___<T extends StorageItem>(key: string, item: T, set: void | Error): void | Error {
    if (set instanceof Error) return set
    ModuleLogger.debug(this.name, 'remove', `The item ${key} has been set.`, item)
  }

  remove<T extends StorageItem>(key: string, keys?: KeyOf.Deep<T>[]): void | Error | Promise<void | Error> {
    let item: T | Error

    if (typeof keys === 'undefined') {
      return this.remove_(key, this._remove(key) as void | Error)
    }

    item = this.remove__(key, keys, this._get(key) as T | Error)
    if (item instanceof Error) return item

    return this.remove___(key, item, this._set(key, item) as void | Error)
  }

  protected set_<T extends StorageItem>(key: string, item: T | Error, set: void | Error): void | Error {
    if (item instanceof Error) return item
    if (set instanceof Error) return set

    ModuleLogger.debug(this.name, 'set', `The item ${key} has been set.`, item)
  }

  protected set__<T extends StorageItem>(item: T, keys: KeyOf.Deep<T>[], current: T | Error): T | Error {
    if (current instanceof Error) return current

    for (let k of keys) {
      copyObjectProperty(item, k, current)
    }

    return current
  }

  set<T extends StorageItem>(key: string, item: T, keys?: KeyOf.Deep<T>[]): void | Error | Promise<void | Error> {
    let current: T | Error

    if (typeof keys === 'undefined') {
      return this.set_(key, item, this._set(key, item) as void | Error)
    }

    current = this.set__(item, keys, this._get(key) as T | Error)
    if (current instanceof Error) return current

    return this.set_(key, item, this._set(key, current) as void | Error)
  }

  protected copy_<T1 extends StorageItem, T2 extends StorageTarget, T extends T1 & T2>(
    key: string,
    target: T2,
    keys: KeyOf.Deep<T>[] | undefined,
    item: T1 | Error
  ): void | Error {
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

  copy<T1 extends StorageItem, T2 extends StorageTarget, T extends T1 & T2>(
    key: string,
    target: T2,
    keys?: KeyOf.Deep<T>[]
  ): void | Error | Promise<void | Error> {
    return this.copy_(key, target, keys, this._get(key))
  }

  protected has_<T extends StorageItem>(keys: KeyOf.Deep<T>[] | undefined, item: T | Error): boolean {
    if (item instanceof Error) return false

    if (typeof keys === 'undefined') {
      return true
    }

    for (let k of keys) {
      if (hasObjectProperty(item, k)) {
        continue
      }

      return false
    }

    return true
  }

  has<T extends StorageItem>(key: string, keys?: KeyOf.Deep<T>[]): boolean | Promise<boolean> {
    let has: boolean | Error

    has = this._has(key) as boolean | Error
    if (has instanceof Error || !has) return false

    return this.has_(keys, this._get(key) as T | Error)
  }
}
