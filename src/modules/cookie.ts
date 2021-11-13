import { CookieSerializeOptions, parse, serialize } from 'cookie'
import { AnyObject, StringObject } from '../definitions/interfaces'
import { ModuleLogger } from '../loggers/module.logger'
import { Environment } from '../modules/environment'
import { StringUtils } from '../utils/string.utils'
import { rc } from './rc'
import { tc } from './tc'

/**
 * A module to handle cookies through a store.
 *
 * Usage:
 *
 * ```typescript
 * import { Cookie } from '@queelag/core'
 *
 * interface AuthData {
 *   token: string
 * }
 *
 * class AuthStore {
 *   data: AuthData
 *
 *   constructor() {
 *     this.data = { token: '' }
 *     Cookie.get(this.name, this.data)
 *   }
 *
 *   login(): void {
 *     let response: string
 *
 *     response = 'token'
 *     this.token = response
 *
 *     Cookie.set(this.name, this.data, ['token'], { secure: true })
 *   }
 *
 *   logout(): void {
 *     Cookie.remove(this.name, this.data)
 *   }
 *
 *   get name(): string {
 *     return 'auth'
 *   }
 * }
 * ```
 *
 * @category Module
 */
export class Cookie {
  /** @hidden */
  constructor() {}

  /**
   * Sets a value for each key in keys found in the cookies prefixed by the name.
   *
   * @template T The store interface which extends {@link AnyObject}.
   */
  static get<T extends AnyObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store)): boolean {
    let parsed: StringObject | Error, value: string

    if (Environment.isWindowNotDefined) {
      ModuleLogger.warn('Cookie', 'get', `The window is not defined.`)
      return true
    }

    parsed = this.parse(document.cookie)
    if (parsed instanceof Error) return false

    ModuleLogger.debug('Cookie', 'get', `The cookies have been parsed as JSON.`, parsed)

    keys.forEach((k: keyof T) => {
      value = (parsed as StringObject)[StringUtils.concat(name, k as string)]
      if (!value) return ModuleLogger.warn('Cookie', 'get', `The JSON does not contain the key ${k}.`, parsed)

      store[k] = value as any
      ModuleLogger.debug('Cookie', 'get', `The key ${k} has been set with value ${value}.`)
    })

    return true
  }

  /**
   * Sets a cookie for each key in keys prefixed by the name.
   *
   * @template T The store interface which extends {@link AnyObject}.
   */
  static set<T extends AnyObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store), options: CookieSerializeOptions = {}): boolean {
    if (Environment.isWindowNotDefined) {
      ModuleLogger.warn('Cookie', 'set', `The window is not defined.`)
      return true
    }

    return keys
      .map((k: keyof T) => {
        let serialized: string | Error

        serialized = this.serialize(StringUtils.concat(name, k as string), store[k], options)
        if (serialized instanceof Error)
          return rc(() => ModuleLogger.error('Cookie', 'set', `Failed to set the key ${k} with value ${store[k]}.`, options), false)

        document.cookie = serialized
        ModuleLogger.debug('Cookie', 'set', `The key ${k} has been set with value ${store[k]}.`, options)

        return true
      })
      .every((v: boolean) => v)
  }

  /**
   * Removes a cookie for each key in keys prefixed by the name.

  * @template T The store interface which extends {@link AnyObject}.
   */
  static remove<T extends AnyObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store)): boolean {
    if (Environment.isWindowNotDefined) {
      ModuleLogger.warn('Cookie', 'remove', `The window is not defined.`)
      return true
    }

    return keys
      .map((k: keyof T) => {
        let serialized: string | Error

        serialized = this.serialize(StringUtils.concat(name, k as string), store[k], { expires: new Date(0) })
        if (serialized instanceof Error) return rc(() => ModuleLogger.error('Cookie', 'set', `Failed to set the key ${k} with value ${store[k]}.`), false)

        document.cookie = serialized
        ModuleLogger.debug('Cookie', 'remove', `The key ${k} has been removed.`)

        return true
      })
      .every((v: boolean) => v)
  }

  static parse(cookie: string): StringObject | Error {
    return tc(() => parse(cookie))
  }

  static serialize(key: string, value: string, options?: CookieSerializeOptions): string | Error {
    return tc(() => serialize(key, value, options))
  }
}
