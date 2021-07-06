import Cookies, { CookieAttributes } from 'js-cookie'
import { StringUtils } from '../utils/string.utils'
import { Logger } from './logger'
import { tc } from './tc'

type StringObject = { [k: string]: string }

export class Cookie {
  static get<T extends StringObject>(name: string, store: T): boolean {
    let json: StringObject | Error

    json = tc(() => Cookies.getJSON())
    if (json instanceof Error) return false

    Logger.debug('Cookie', 'load', `The cookies have been parsed as JSON.`, json)

    Object.entries(json).forEach((v: [string, string]) => {
      if (v[0].includes(name + '_')) {
        store[v[0].replace(name + '_', '') as keyof T] = v[1] as any
        Logger.debug('Cookie', 'load', `The key ${v[0]} has been set with value ${v[1]}.`)
      }
    })

    return true
  }

  static set<T extends StringObject>(name: string, store: T, keys: (keyof T)[], attributes: CookieAttributes = {}): boolean {
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

  static remove(name: string): boolean {
    let json: StringObject | Error, removes: boolean[]

    json = tc(() => Cookies.getJSON())
    if (json instanceof Error) return false

    Logger.debug('Cookie', 'load', `The cookies have been parsed as JSON.`, json)

    removes = Object.entries(json).map((v: [string, string]) => {
      if (v[0].includes(name + '_')) {
        let removed: void | Error

        removed = tc(() => Cookies.remove(v[0]))
        if (removed instanceof Error) return false

        Logger.debug('Cookie', 'remove', `The key ${v[0]} has been removed.`)
      }

      return true
    })

    return removes.every((v: boolean) => v)
  }
}
