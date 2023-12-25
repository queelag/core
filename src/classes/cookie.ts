import { CookieParseOptions, CookieSerializeOptions } from 'cookie'
import { DEFAULT_COOKIE_SEPARATOR } from '../definitions/constants.js'
import { CookieItem, CookieObject } from '../definitions/interfaces.js'
import { KeyOf, Primitive } from '../definitions/types.js'
import { mtc } from '../functions/mtc.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { deserializeCookie, serializeCookie } from '../utils/cookie-utils.js'
import { isObject, setObjectProperty } from '../utils/object-utils.js'

/**
 * The Cookie class is an abstraction to implement any cookie API in an uniform way.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/cookie)
 */
export class Cookie {
  /**
   * The cookie instance name.
   */
  readonly name: string
  /**
   * The cookie separator used to separate the cookie name from the cookie item key.
   */
  readonly separator: string = DEFAULT_COOKIE_SEPARATOR

  private readonly _get: () => string | Error
  private readonly _set: (cookies: string) => void | Error

  constructor(name: string, get: () => string, set: (cookies: string) => void, separator: string = DEFAULT_COOKIE_SEPARATOR) {
    this.name = name
    this.separator = separator

    this._get = mtc(get)
    this._set = mtc(set)
  }

  /**
   * Clears all cookies.
   */
  clear(options: CookieSerializeOptions = {}): void | Error {
    let object: CookieObject | Error

    object = this.deserialize()
    if (object instanceof Error) return object

    for (let key in object) {
      let serialized: string | Error, set: void | Error

      serialized = this.serialize(key, '', { ...options, expires: new Date(0) })
      if (serialized instanceof Error) return serialized

      set = this._set(serialized)
      if (set instanceof Error) return set

      ClassLogger.debug(this.name, 'remove', `The cookie ${key} has been removed.`)
    }
  }

  /**
   * Retrieves an item from the cookies.
   */
  get<T extends CookieItem>(key: string): T | Error {
    let object: CookieObject | Error, item: T

    object = this.deserialize()
    if (object instanceof Error) return object

    ClassLogger.debug(this.name, 'get', `The cookies have been parsed.`, object)

    item = {} as T

    for (let k in object) {
      if (!k.startsWith(key + this.separator)) {
        ClassLogger.debug(this.name, 'get', `The cookie ${k} has been skipped.`)
        continue
      }

      setObjectProperty(item, this.toCookieItemKey(key, k), object[k])
      ClassLogger.debug(this.name, 'get', `The cookie ${k} has been set to the item.`, item)
    }

    return item
  }

  /**
   * Removes an item from the cookies.
   * Optionally you can specify the keys of the item that you want to remove, if you don't specify any key the whole item will be removed.
   */
  remove<T extends CookieItem>(key: string, options: CookieSerializeOptions = {}, keys?: KeyOf.Shallow<T>[]): void | Error {
    if (typeof keys === 'undefined') {
      let object: CookieObject | Error

      object = this.deserialize()
      if (object instanceof Error) return object

      keys = []

      for (let k in object) {
        if (!k.startsWith(key)) {
          ClassLogger.debug(this.name, 'get', `The key ${k} has been skipped.`)
          continue
        }

        keys.push(this.toCookieItemKey(key, k))
        ClassLogger.debug(this.name, 'get', `The key ${k} has been pushed to the keys.`, keys)
      }
    }

    for (let k of keys) {
      let serialized: string | Error, set: void | Error

      serialized = this.serialize(key, k, '', { ...options, expires: new Date(0) })
      if (serialized instanceof Error) return serialized

      set = this._set(serialized)
      if (set instanceof Error) return set

      ClassLogger.debug(this.name, 'remove', `The key ${String(k)} has been removed.`)
    }
  }

  /**
   * Sets an item in the cookies.
   * Optionally you can specify the keys of the item that you want to set, if you don't specify any key the whole item will be set.
   */
  set<T extends CookieItem>(key: string, item: T, options: CookieSerializeOptions = {}, keys?: KeyOf.Shallow<T>[]): void | Error {
    if (typeof keys === 'undefined') {
      keys = Object.keys(item)
      ClassLogger.debug(this.name, 'set', `The keys have been derived from the item.`, keys)
    }

    for (let k of keys) {
      let serialized: string | Error, set: void | Error

      serialized = this.serialize(key, k, item[k], options)
      if (serialized instanceof Error) return serialized

      set = this._set(serialized)
      if (set instanceof Error) return set

      ClassLogger.debug(this.name, 'set', `The key ${String(k)} has been set.`, this._get(), options)
    }
  }

  /**
   * Copies an item from the cookies to a target object.
   * Optionally you can specify the keys of the item that you want to copy, if you don't specify any key the whole item will be copied.
   */
  copy<T1 extends CookieItem, T2 extends CookieItem = CookieItem, T extends T1 & T2 = T1 & T2>(
    key: string,
    target: T2,
    keys?: KeyOf.Shallow<T>[]
  ): void | Error {
    let object: CookieObject | Error

    object = this.deserialize()
    if (object instanceof Error) return object

    ClassLogger.debug(this.name, 'copy', `The cookies have been parsed.`, object)

    if (typeof keys === 'undefined') {
      keys = []

      for (let k in object) {
        if (!k.startsWith(key)) {
          ClassLogger.debug(this.name, 'parse', `The key ${k} has been skipped.`)
          continue
        }

        keys.push(this.toCookieItemKey(key, k))
        ClassLogger.debug(this.name, 'parse', `The key ${k} has been pushed to the keys.`, keys)
      }
    }

    for (let k of keys) {
      target[k] = object[this.toDocumentCookieName(key, k)] as T2[keyof T]
      ClassLogger.debug(this.name, 'parse', `The cookie ${String(k)} has been copied to the target.`, target)
    }
  }

  /**
   * Checks if an item exists in the cookies.
   * Optionally you can specify the keys of the item that you want to check, if you don't specify any key the whole item will be checked.
   */
  has<T extends CookieItem>(key: string, keys?: KeyOf.Shallow<T>[]): boolean {
    let object: CookieObject | Error

    object = this.deserialize()
    if (object instanceof Error) return false

    ClassLogger.debug(this.name, 'get', `The cookies have been parsed.`, object)

    if (typeof keys === 'undefined') {
      for (let k in object) {
        if (k.startsWith(key + this.separator)) {
          return true
        }
      }

      return false
    }

    for (let k of keys) {
      if (this.toDocumentCookieName(key, k) in object) {
        continue
      }

      return false
    }

    return true
  }

  protected deserialize(options?: CookieParseOptions): CookieObject | Error {
    let cookie: string | Error

    cookie = this._get()
    if (cookie instanceof Error) return cookie

    return deserializeCookie(cookie, options)
  }

  protected serialize(key: string, value: string, options?: CookieSerializeOptions): string | Error
  protected serialize<T extends CookieItem>(key: string, ik: keyof T, value: Primitive, options?: CookieSerializeOptions): string | Error
  protected serialize<T extends CookieItem>(key: string, ...args: any[]): string | Error {
    let ik: keyof T | undefined, value: Primitive, options: CookieSerializeOptions | undefined

    ik = isObject(args[1]) ? undefined : args[0]
    value = isObject(args[1]) ? args[0] : args[1]
    options = isObject(args[1]) ? args[1] : args[2]

    return serializeCookie(typeof ik === 'undefined' ? key : this.toDocumentCookieName(key, ik), String(value), options)
  }

  protected toCookieItemKey<T extends CookieItem>(key: string, ik: KeyOf.Shallow<T>): string {
    return String(ik).replace(key + this.separator, '')
  }

  protected toDocumentCookieName<T extends CookieItem>(key: string, ik: KeyOf.Shallow<T>): string {
    return key + this.separator + String(ik)
  }
}
