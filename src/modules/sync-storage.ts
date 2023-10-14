import { StorageItem, StorageTarget } from '../definitions/interfaces.js'
import { mtc } from '../functions/mtc.js'
import { Storage } from './storage.js'

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

  clear(): void | Error {
    return super.clear() as void | Error
  }

  get<T extends StorageItem>(key: string): T | Error {
    return super.get(key) as T | Error
  }

  remove<T extends StorageItem>(key: string, keys?: (keyof T)[] | undefined): void | Error {
    return super.remove(key, keys) as void | Error
  }

  set<T extends StorageItem>(key: string, item: T, keys?: (keyof T)[] | undefined): void | Error {
    return super.set(key, item, keys) as void | Error
  }

  copy<T1 extends StorageItem, T2 extends StorageTarget, T extends T1 & T2>(key: string, target: T2, keys?: (keyof T)[] | undefined): void | Error {
    return super.copy(key, target, keys) as void | Error
  }

  has<T extends StorageItem>(key: string, keys?: (keyof T)[] | undefined): boolean {
    return super.has(key, keys) as boolean
  }
}
