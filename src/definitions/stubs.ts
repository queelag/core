import { deserializeCookie } from '../utils/cookie.utils'
import { CookieObject } from './interfaces'

export const STUB_COOKIE_GET: (map: Map<string, string>) => () => string = (map: Map<string, string>) => () =>
  [...map.entries()].map(([k, v]) => [k, v].join('=')).join(';')

export const STUB_COOKIE_SET: (map: Map<string, string>, deserialize?: Function) => (cookie: string) => void =
  (map: Map<string, string>, deserialize: Function = deserializeCookie) =>
  (cookie: string) => {
    let object: CookieObject | Error

    object = deserialize(cookie)
    if (object instanceof Error) return

    for (let k in object) {
      if (cookie.includes('Expires=Thu, 01 Jan 1970 00:00:00 GMT')) {
        map.delete(k)
        continue
      }

      map.set(k, object[k])
    }
  }

export const STUB_STORAGE: (map: Map<string, string>) => Storage = (map: Map<string, string>) => ({
  clear: () => map.clear(),
  getItem: (key: string) => {
    let value: string | undefined

    value = map.get(key)
    if (typeof value === 'undefined') return null

    return value
  },
  key: (index: number) => {
    let key: string | undefined

    key = [...map.keys()][index]
    if (typeof key === 'undefined') return null

    return key
  },
  removeItem: (key: string) => {
    map.delete(key)
  },
  setItem: (key: string, value: string) => {
    map.set(key, value)
  },
  get length(): number {
    return map.size
  }
})

export const STUB_TEXT_DECODER: TextDecoder = Object.freeze({
  decode: () => '',
  encoding: '',
  fatal: false,
  ignoreBOM: false
})

export const STUB_TEXT_ENCODER: TextEncoder = Object.freeze({
  encode: () => new Uint8Array(),
  encodeInto: () => ({ read: 0, written: 0 }),
  encoding: ''
})
