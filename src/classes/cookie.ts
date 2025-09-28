import { DEFAULT_COOKIE_SEPARATOR } from '../definitions/constants.js'
import type { CookieItem, CookieOptions, CookieTarget } from '../definitions/interfaces.js'
import type { KeyOf } from '../definitions/types.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { copyObjectProperty, hasObjectProperty, pickObjectProperties } from '../utils/object-utils.js'

type Clear = <U>(options?: U) => ClearReturn
type ClearReturn = void | Error | Promise<void | Error>

type CopyReturn = void | Error | Promise<void | Error>

type Get = <T extends CookieItem, U>(key: string, options?: U) => GetReturn<T>
type GetReturn<T extends CookieItem> = T | Error | Promise<T | Error>

type Has = <U>(key: string, options?: U) => HasReturn
type HasReturn = boolean | Error | Promise<boolean | Error>

type Remove = <U>(key: string, options?: U) => RemoveReturn
type RemoveReturn = void | Error | Promise<void | Error>

type Set = <T extends CookieItem, U>(key: string, item: T, options?: U) => SetReturn
type SetReturn = void | Error | Promise<void | Error>

export class Cookie<Options extends CookieOptions> {
  /**
   * The cookie instance name.
   */
  protected readonly name: string
  /**
   * The cookie options.
   */
  protected options?: Options

  protected readonly _clear: Clear
  protected readonly _get: Get
  protected readonly _has: Has
  protected readonly _remove: Remove
  protected readonly _set: Set

  constructor(name: string, clear: Clear, get: Get, has: Has, remove: Remove, set: Set, options?: Options) {
    this.name = name
    this.options = options

    this._clear = clear
    this._get = get
    this._has = has
    this._remove = remove
    this._set = set
  }

  protected clear_(cleared: void | Error): void | Error {
    if (cleared instanceof Error) return cleared
    ClassLogger.debug(this.name, 'clear', `The cookies have been cleared.`)
  }

  clear(options?: unknown): ClearReturn {
    return this.clear_(this._clear(options) as void | Error)
  }

  protected get_<T extends CookieItem>(key: string, item: T | Error): T | Error {
    if (item instanceof Error) return item
    ClassLogger.debug(this.name, 'get', `The item ${key} has been retrieved.`, item)

    return item
  }

  get<T extends CookieItem>(key: string, options?: unknown): GetReturn<T> {
    return this.get_(key, this._get(key, options) as T | Error)
  }

  protected remove_(key: string, removed: void | Error): void | Error {
    if (removed instanceof Error) return removed
    ClassLogger.debug(this.name, 'remove', `The item ${key} has been removed.`)
  }

  remove(key: string, options?: unknown): RemoveReturn {
    return this.remove_(key, this._remove(key, options) as void | Error)
  }

  protected set_<T extends CookieItem>(key: string, item: T | Error, set: void | Error): void | Error {
    if (item instanceof Error) return item
    if (set instanceof Error) return set

    ClassLogger.debug(this.name, 'set', `The item ${key} has been set.`, item)
  }

  protected set__<T extends CookieItem>(item: T, keys: KeyOf.Deep<T>[], current: T | Error): T | Error {
    if (current instanceof Error) {
      return pickObjectProperties(item, keys)
    }

    for (let k of keys) {
      copyObjectProperty(item, k, current)
    }

    return current
  }

  set<T extends CookieItem>(key: string, item: T, keys?: KeyOf.Deep<T>[], options?: unknown): SetReturn {
    let current: T | Error

    if (typeof keys === 'undefined') {
      return this.set_(key, item, this._set(key, item, options) as void | Error)
    }

    current = this.set__(item, keys, this._get(key) as T | Error)
    if (current instanceof Error) return current

    return this.set_(key, item, this._set(key, current, options) as void | Error)
  }

  protected copy_<T1 extends CookieItem, T2 extends CookieTarget, T extends T1 & T2>(
    key: string,
    target: T2,
    keys: KeyOf.Deep<T>[] | undefined,
    item: T1 | Error
  ): void | Error {
    if (item instanceof Error) return

    ClassLogger.debug(this.name, 'copy', `The item ${key} has been retrieved.`, item)

    if (typeof keys === 'undefined') {
      keys = Object.keys(item)
    }

    for (let k of keys) {
      if (!hasObjectProperty(item, k)) {
        continue
      }

      copyObjectProperty(item, k, target)
      ClassLogger.debug(this.name, 'copy', `The ${key} ${String(k)} property has been copied.`, target)
    }
  }

  copy<T1 extends CookieItem, T2 extends CookieTarget, T extends T1 & T2>(key: string, target: T2, keys?: KeyOf.Deep<T>[], options?: unknown): CopyReturn {
    return this.copy_(key, target, keys, this._get(key, options))
  }

  protected has_<T extends CookieItem>(keys: KeyOf.Deep<T>[] | undefined, item: T | Error): boolean {
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

  has<T extends CookieItem>(key: string, keys?: KeyOf.Deep<T>[], options?: unknown): HasReturn {
    let has: boolean | Error

    has = this._has(key, options) as boolean | Error
    if (has instanceof Error || !has) return false

    return this.has_(keys, this._get(key, options) as T | Error)
  }

  /**
   * Returns the name of the instance.
   */
  getName(): string {
    return this.name
  }

  /**
   * Returns the separator used to separate the cookie name from the cookie item key.
   */
  getSeparator(): string {
    return this.options?.separator ?? DEFAULT_COOKIE_SEPARATOR
  }

  /**
   * Returns the options for the cookie.
   */
  getOptions(): Options | undefined {
    return this.options
  }

  /**
   * Sets the options for the cookie.
   */
  setOptions(options: Options): void {
    this.options = options
  }
}
