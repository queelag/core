import { CookieSerializeOptions, parse, serialize } from 'cookie'
import { CookieObject, CookieValue } from '../definitions/interfaces'
import { rc } from '../functions/rc'
import { tc } from '../functions/tc'
import { ModuleLogger } from '../loggers/module.logger'
import { Environment } from '../modules/environment'
import { setObjectProperty } from '../utils/object.utils'

/**
 * A module to handle cookies through a store.
 *
 * @category Module
 */
export class Cookie {
  /** @hidden */
  constructor() {}

  /**
   * Gets an item.
   *
   * @template T The value interface which extends {@link CookieValue}.
   */
  static get<T extends CookieValue>(key: string): T | Error {
    let parsed: CookieObject | Error, value: T

    if (Environment.isWindowNotDefined) {
      ModuleLogger.warn('Cookie', 'get', `The window object is not defined.`)
      return new Error('The window object is not defined.')
    }

    parsed = this.parse(document.cookie)
    if (parsed instanceof Error) return parsed

    ModuleLogger.debug('Cookie', 'get', `The cookies have been parsed.`, parsed)

    value = {} as T

    for (let k in parsed) {
      if (!k.startsWith(key)) {
        ModuleLogger.debug('Cookie', 'get', `The key ${k} has been skipped.`)
        continue
      }

      setObjectProperty(value[k], k.replace(key + '_', ''), parsed[k])
      ModuleLogger.debug('Cookie', 'get', `The key ${k} has been set to the value.`, value)
    }

    return value
  }

  /**
   * Removes an item, if keys are defined it will only remove those keys of the item.

  * @template T The store interface which extends {@link AnyObject}.
   */
  static remove<T extends CookieValue, K extends keyof T>(key: string, keys?: K[]): void | Error {
    if (Environment.isWindowNotDefined) {
      ModuleLogger.warn('Cookie', 'remove', `The window object is not defined.`)
      return new Error('The window object is not defined.')
    }

    if (typeof keys === 'undefined') {
      let parsed: CookieObject | Error

      parsed = this.parse(document.cookie)
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

      serialized = this.serialize(key + '_' + String(k), '', { expires: new Date(0) })
      if (serialized instanceof Error) return rc(() => ModuleLogger.error('Cookie', 'set', `Failed to remove the key ${String(k)}.`), serialized)

      document.cookie = serialized
      ModuleLogger.debug('Cookie', 'remove', `The key ${String(k)} has been removed.`)

      return
    }
  }

  /**
   * Sets an item.
   *
   * @template T The value interface which extends {@link CookieValue}.
   */
  static set<T extends CookieValue, K extends keyof T>(key: string, value: T, keys?: K[], options: CookieSerializeOptions = {}): void | Error {
    if (Environment.isWindowNotDefined) {
      ModuleLogger.warn('Cookie', 'set', `The window object is not defined.`)
      return new Error('The window object is not defined.')
    }

    if (typeof keys === 'undefined') {
      keys = Object.keys(value) as K[]
      ModuleLogger.debug('Cookie', 'set', `The keys have been derived from the value.`, keys)
    }

    for (let k of keys) {
      let serialized: string | Error

      serialized = this.serialize(key + '_' + String(k), value[k], options)
      if (serialized instanceof Error) return rc(() => ModuleLogger.error('Cookie', 'set', `Failed to set the key ${String(k)}.`, value, options), serialized)

      document.cookie = serialized
      ModuleLogger.debug('Cookie', 'set', `The key ${String(k)} has been set.`, document.cookie, options)

      return
    }
  }

  static parse(cookie: string): CookieObject | Error {
    return tc(() => parse(cookie))
  }

  static serialize(key: string, value: string, options?: CookieSerializeOptions): string | Error {
    return tc(() => serialize(key, value, options))
  }
}
