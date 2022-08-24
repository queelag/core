import { CookieParseOptions, CookieSerializeOptions, parse, serialize } from 'cookie'
import { DEFAULT_COOKIE_TARGET } from '../definitions/constants'
import { CookieObject, CookieTarget, CookieValue } from '../definitions/interfaces'
import { rc } from '../functions/rc'
import { tc } from '../functions/tc'
import { ModuleLogger } from '../loggers/module.logger'
import { setObjectProperty } from '../utils/object'

/**
 * A module to handle cookies through a store.
 *
 * @category Module
 */
export class Cookie {
  static target: CookieTarget = DEFAULT_COOKIE_TARGET()

  /** @hidden */
  constructor() {}

  /**
   * Gets an item.
   *
   * @template T The value interface which extends {@link CookieValue}.
   */
  static get<T extends CookieValue>(key: string, target: CookieTarget = Cookie.target): T | Error {
    let parsed: CookieObject | Error, value: T

    parsed = Cookie.parse(target.get())
    if (parsed instanceof Error) return parsed

    ModuleLogger.debug('Cookie', 'get', `The cookies have been parsed.`, parsed)

    value = {} as T

    for (let k in parsed) {
      if (!k.startsWith(key)) {
        ModuleLogger.debug('Cookie', 'get', `The key ${k} has been skipped.`)
        continue
      }

      setObjectProperty(value, k.replace(key + '_', ''), parsed[k])
      ModuleLogger.debug('Cookie', 'get', `The key ${k} has been set to the value.`, value)
    }

    return value
  }

  /**
   * Removes an item, if keys are defined it will only remove those keys of the item.

  * @template T The store interface which extends {@link AnyObject}.
   */
  static remove<T extends CookieValue, K extends keyof T = keyof T>(key: string, keys?: K[], target: CookieTarget = Cookie.target): void | Error {
    if (typeof keys === 'undefined') {
      let parsed: CookieObject | Error

      parsed = Cookie.parse(target.get())
      if (parsed instanceof Error) return parsed

      keys = []

      for (let k in parsed) {
        if (!k.startsWith(key)) {
          ModuleLogger.debug('Cookie', 'get', `The key ${k} has been skipped.`)
          continue
        }

        keys.push(k.replace(key + '_', '') as K)
        ModuleLogger.debug('Cookie', 'get', `The key ${k} has been pushed to the keys.`, keys)
      }
    }

    for (let k of keys) {
      let serialized: string | Error

      serialized = Cookie.serialize(key + '_' + String(k), '', { expires: new Date(0) })
      if (serialized instanceof Error) return rc(() => ModuleLogger.error('Cookie', 'set', `Failed to serialize the key ${String(k)}.`), serialized)

      target.set(serialized)
      ModuleLogger.debug('Cookie', 'remove', `The key ${String(k)} has been removed.`)

      return
    }
  }

  /**
   * Sets an item.
   *
   * @template T The value interface which extends {@link CookieValue}.
   */
  static set<T extends CookieValue, K extends keyof T = keyof T>(
    key: string,
    value: T,
    options: CookieSerializeOptions = {},
    keys?: K[],
    target: CookieTarget = Cookie.target
  ): void | Error {
    if (typeof keys === 'undefined') {
      keys = Object.keys(value) as K[]
      ModuleLogger.debug('Cookie', 'set', `The keys have been derived from the value.`, keys)
    }

    for (let k of keys) {
      let serialized: string | Error

      serialized = this.serialize(key + '_' + String(k), value[k], options)
      if (serialized instanceof Error)
        return rc(() => ModuleLogger.error('Cookie', 'set', `Failed to serialize the key ${String(k)}.`, value, options), serialized)

      target.set(serialized)
      ModuleLogger.debug('Cookie', 'set', `The key ${String(k)} has been set.`, target.get(), options)
    }
  }

  /**
   * Parse an HTTP Cookie header string and returning an object of all cookie
   * name-value pairs.
   */
  static parse(cookie: string, options?: CookieParseOptions): CookieObject | Error {
    return tc(() => parse(cookie, options))
  }

  /**
   * Serialize a cookie name-value pair into a `Set-Cookie` header string.
   */
  static serialize(key: string, value: string, options?: CookieSerializeOptions): string | Error {
    return tc(() => serialize(key, value, options))
  }
}
