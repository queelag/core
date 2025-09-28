import type { CookieItem, CookieOptions, CookieTarget } from '../definitions/interfaces.js'
import type { KeyOf } from '../definitions/types.js'
import { mtc } from '../functions/mtc.js'
import { Cookie } from './cookie.js'

/**
 * The SyncCookie class is an abstraction to implement any synchronous cookie API in an uniform way.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/sync-cookie)
 */
export class SyncCookie<
  Options extends CookieOptions = CookieOptions,
  GetOptions = unknown,
  SetOptions = unknown,
  ClearOptions = SetOptions,
  CopyOptions = GetOptions,
  HasOptions = GetOptions,
  RemoveOptions = SetOptions
> extends Cookie<Options> {
  constructor(
    name: string,
    clear: (options?: ClearOptions) => void,
    get: <T extends CookieItem>(key: string, options?: GetOptions) => T,
    has: (key: string, options?: HasOptions) => boolean,
    remove: <T extends CookieItem>(key: string, keys?: KeyOf.Shallow<T>[], options?: RemoveOptions) => void,
    set: <T extends CookieItem>(key: string, item: T, options?: SetOptions) => void
  ) {
    super(name, mtc(clear), mtc(get), mtc(has), mtc(remove), mtc(set))
  }

  /**
   * Clears all cookies.
   */
  clear(options?: ClearOptions): void | Error {
    return super.clear(options) as void | Error
  }

  /**
   * Retrieves an item from the cookies.
   */
  get<T extends CookieItem>(key: string, options?: GetOptions): T | Error {
    return super.get(key, options) as T | Error
  }

  /**
   * Removes an item from the cookies.
   * Optionally you can specify the keys of the item that you want to remove, if you don't specify any key the whole item will be removed.
   */
  remove<T extends CookieItem>(key: string, keys?: KeyOf.Shallow<T>[], options?: RemoveOptions): void | Error {
    return super.remove(key, keys, options) as void | Error
  }

  /**
   * Sets an item in the cookies.
   * Optionally you can specify the keys of the item that you want to set, if you don't specify any key the whole item will be set.
   */
  set<T extends CookieItem>(key: string, item: T, keys?: KeyOf.Shallow<T>[], options?: SetOptions): void | Error {
    return super.set(key, item, keys, options) as void | Error
  }

  /**
   * Copies an item from the cookies to a target object.
   * Optionally you can specify the keys of the item that you want to copy, if you don't specify any key the whole item will be copied.
   */
  copy<T1 extends CookieItem, T2 extends CookieTarget = CookieTarget, T extends T1 & T2 = T1 & T2>(
    key: string,
    target: T2,
    keys?: KeyOf.Shallow<T>[],
    options?: CopyOptions
  ): void | Error {
    return super.copy(key, target, keys, options) as void | Error
  }

  /**
   * Checks if an item exists in the cookies.
   * Optionally you can specify the keys of the item that you want to check, if you don't specify any key the whole item will be checked.
   */
  has<T extends CookieItem>(key: string, keys?: KeyOf.Shallow<T>[], options?: HasOptions): boolean {
    return super.has(key, keys, options) as boolean
  }
}
