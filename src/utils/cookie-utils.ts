import { CookieParseOptions, CookieSerializeOptions, parse, serialize } from 'cookie'
import { CookieObject } from '../definitions/interfaces.js'
import { tc } from '../functions/tc.js'

export function deserializeCookie(cookie: string, options?: CookieParseOptions): CookieObject {
  let object: CookieObject | Error

  object = tc(() => parse(cookie, options))
  if (object instanceof Error) return {}

  return object
}

export function serializeCookie(key: string, value: string, options?: CookieSerializeOptions): string | Error {
  return tc(() => serialize(key, value, options))
}
