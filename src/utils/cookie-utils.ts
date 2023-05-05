import { CookieParseOptions, CookieSerializeOptions, parse, serialize } from 'cookie'
import { CookieObject } from '../definitions/interfaces.js'
import { tc } from '../functions/tc.js'

/**
 * Parse an HTTP Cookie header string and returning an object of all cookie
 * name-value pairs.
 */
export function deserializeCookie(cookie: string, options?: CookieParseOptions): CookieObject {
  let object: CookieObject | Error

  object = tc(() => parse(cookie, options))
  if (object instanceof Error) return {}

  return object
}

/**
 * Serialize a cookie name-value pair into a `Set-Cookie` header string.
 */
export function serializeCookie(key: string, value: string, options?: CookieSerializeOptions): string | Error {
  return tc(() => serialize(key, value, options))
}
