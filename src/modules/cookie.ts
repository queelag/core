import { CookieParseOptions, CookieSerializeOptions } from 'cookie'
import { DEFAULT_COOKIE_SEPARATOR } from '../definitions/constants.js'
import { CookieItem, CookieObject } from '../definitions/interfaces.js'
import { KeyOf, Primitive } from '../definitions/types.js'
import { mtcp } from '../functions/mtcp.js'
import { ModuleLogger } from '../loggers/module-logger.js'
import { deserializeCookie, serializeCookie } from '../utils/cookie-utils.js'
import { setObjectProperty } from '../utils/object-utils.js'

/**
 * @category Module
 */
export class Cookie {
  name: string
  separator: string = DEFAULT_COOKIE_SEPARATOR

  private readonly _get: () => Promise<string | Error>
  private readonly _set: (cookies: string) => Promise<void | Error>

  constructor(name: string, get: () => Promise<string>, set: (cookies: string) => Promise<void>, separator: string = DEFAULT_COOKIE_SEPARATOR) {
    this.name = name
    this.separator = separator

    this._get = mtcp(get)
    this._set = mtcp(set)
  }

  async clear(options: CookieSerializeOptions = {}): Promise<void | Error> {
    let object: CookieObject | Error

    object = await this.deserialize()
    if (object instanceof Error) return object

    for (let key in object) {
      let serialized: string | Error, set: void | Error

      serialized = this.serialize(key, '', { ...options, expires: new Date(0) })
      if (serialized instanceof Error) return serialized

      set = await this._set(serialized)
      if (set instanceof Error) return set

      ModuleLogger.debug(this.name, 'remove', `The cookie ${key} has been removed.`)
    }
  }

  async get<T extends CookieItem>(key: string): Promise<T | Error> {
    let object: CookieObject | Error, item: T

    object = await this.deserialize()
    if (object instanceof Error) return object

    ModuleLogger.debug(this.name, 'get', `The cookies have been parsed.`, object)

    item = {} as T

    for (let k in object) {
      if (!k.startsWith(key + this.separator)) {
        ModuleLogger.debug(this.name, 'get', `The cookie ${k} has been skipped.`)
        continue
      }

      setObjectProperty(item, this.toCookieItemKey(key, k), object[k])
      ModuleLogger.debug(this.name, 'get', `The cookie ${k} has been set to the item.`, item)
    }

    return item
  }

  async remove<T extends CookieItem>(key: string, options: CookieSerializeOptions = {}, keys?: KeyOf.Shallow<T>[]): Promise<void | Error> {
    if (typeof keys === 'undefined') {
      let object: CookieObject | Error

      object = await this.deserialize()
      if (object instanceof Error) return object

      keys = []

      for (let k in object) {
        if (!k.startsWith(key)) {
          ModuleLogger.debug(this.name, 'get', `The key ${k} has been skipped.`)
          continue
        }

        keys.push(this.toCookieItemKey(key, k))
        ModuleLogger.debug(this.name, 'get', `The key ${k} has been pushed to the keys.`, keys)
      }
    }

    for (let k of keys) {
      let serialized: string | Error, set: void | Error

      serialized = this.serialize(key, k, '', { ...options, expires: new Date(0) })
      if (serialized instanceof Error) return serialized

      set = await this._set(serialized)
      if (set instanceof Error) return set

      ModuleLogger.debug(this.name, 'remove', `The key ${String(k)} has been removed.`)
    }
  }

  async set<T extends CookieItem>(key: string, item: T, options: CookieSerializeOptions = {}, keys?: KeyOf.Shallow<T>[]): Promise<void | Error> {
    if (typeof keys === 'undefined') {
      keys = Object.keys(item)
      ModuleLogger.debug(this.name, 'set', `The keys have been derived from the item.`, keys)
    }

    for (let k of keys) {
      let serialized: string | Error, set: void | Error

      serialized = this.serialize(key, k, item[k], options)
      if (serialized instanceof Error) return serialized

      set = await this._set(serialized)
      if (set instanceof Error) return set

      ModuleLogger.debug(this.name, 'set', `The key ${String(k)} has been set.`, this._get(), options)
    }
  }

  async copy<T1 extends CookieItem, T2 extends CookieItem = CookieItem, T extends T1 & T2 = T1 & T2>(
    key: string,
    target: T2,
    keys?: KeyOf.Shallow<T>[]
  ): Promise<void | Error> {
    let object: CookieObject | Error

    object = await this.deserialize()
    if (object instanceof Error) return object

    ModuleLogger.debug(this.name, 'copy', `The cookies have been parsed.`, object)

    if (typeof keys === 'undefined') {
      keys = []

      for (let k in object) {
        if (!k.startsWith(key)) {
          ModuleLogger.debug(this.name, 'parse', `The key ${k} has been skipped.`)
          continue
        }

        keys.push(this.toCookieItemKey(key, k))
        ModuleLogger.debug(this.name, 'parse', `The key ${k} has been pushed to the keys.`, keys)
      }
    }

    for (let k of keys) {
      target[k] = object[this.toDocumentCookieName(key, k)] as T2[keyof T]
      ModuleLogger.debug(this.name, 'parse', `The cookie ${String(k)} has been copied to the target.`, target)
    }
  }

  async has<T extends CookieItem>(key: string, keys?: KeyOf.Shallow<T>[]): Promise<boolean> {
    let object: CookieObject | Error

    object = await this.deserialize()
    if (object instanceof Error) return false

    ModuleLogger.debug(this.name, 'get', `The cookies have been parsed.`, object)

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

  private async deserialize(options?: CookieParseOptions): Promise<CookieObject | Error> {
    let cookie: string | Error

    cookie = await this._get()
    if (cookie instanceof Error) return cookie

    return deserializeCookie(cookie, options)
  }

  private serialize(key: string, value: string, options?: CookieSerializeOptions): string | Error
  private serialize<T extends CookieItem>(key: string, ik: keyof T, value: Primitive, options?: CookieSerializeOptions): string | Error
  private serialize<T extends CookieItem>(...args: any[]): string | Error {
    let key: string, ik: keyof T | undefined, value: Primitive, options: CookieSerializeOptions | undefined

    key = args[0]
    ik = typeof args[2] !== 'object' ? args[1] : undefined
    value = typeof args[2] !== 'object' ? args[2] : args[1]
    options = typeof args[2] !== 'object' ? args[3] : args[2]

    return serializeCookie(typeof ik === 'undefined' ? key : this.toDocumentCookieName(key, ik), String(value), options)
  }

  private toCookieItemKey<T extends CookieItem>(key: string, ik: KeyOf.Shallow<T>): string {
    return String(ik).replace(key + this.separator, '')
  }

  private toDocumentCookieName<T extends CookieItem>(key: string, ik: KeyOf.Shallow<T>): string {
    return key + this.separator + String(ik)
  }
}
