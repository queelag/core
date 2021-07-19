import Cookies, { CookieAttributes } from 'js-cookie'
import { StringObject } from '../definitions/interfaces'
import { StringUtils } from '../utils/string.utils'
import { Logger } from './logger'
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
   * Sets a value for each key in keys found in the cookies prefixed by the name
   *
   * @template T The store interface which extends {@link StringObject}
   */
  static get<T extends StringObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store)): boolean {
    let json: StringObject | Error, value: string

    json = tc(() => Cookies.getJSON())
    if (json instanceof Error) return false

    Logger.debug('Cookie', 'load', `The cookies have been parsed as JSON.`, json)

    keys.forEach((k: keyof T) => {
      value = (json as StringObject)[StringUtils.concat(name, k as string)]
      if (!value) return Logger.error('Cookie', 'get', `The JSON does not contain the key ${k}.`, json)

      store[k] = value as any
      Logger.debug('Cookie', 'load', `The key ${k} has been set with value ${value}.`)
    })

    return true
  }

  /**
   * Sets a cookie for each key in keys prefixed by the name
   *
   * @template T The store interface which extends {@link StringObject}
   */
  static set<T extends StringObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store), attributes: CookieAttributes = {}): boolean {
    let sets: boolean[]

    sets = keys.map((k: keyof T) => {
      let set: string | undefined | Error

      set = tc(() => Cookies.set(StringUtils.concat(name, k as string), store[k], attributes))
      if (set instanceof Error || !set) return false

      Logger.debug('Cookie', 'save', `The key ${k} has been set with value ${store[k]}.`)

      return true
    })

    return sets.every((v: boolean) => v)
  }

  /**
   * Removes a cookie for each key in keys prefixed by the name

  * @template T The store interface which extends {@link StringObject}
   */
  static remove<T extends StringObject>(name: string, store: T, keys: (keyof T)[] = Object.keys(store)): boolean {
    let json: StringObject | Error, removes: boolean[]

    json = tc(() => Cookies.getJSON())
    if (json instanceof Error) return false

    Logger.debug('Cookie', 'load', `The cookies have been parsed as JSON.`, json)

    removes = keys.map((k: keyof T) => {
      let removed: void | Error

      removed = tc(() => Cookies.remove(StringUtils.concat(name, k as string)))
      if (removed instanceof Error) return false

      Logger.debug('Cookie', 'remove', `The key ${k} has been removed.`)

      return true
    })

    return removes.every((v: boolean) => v)
  }
}
