import { CookieParseOptions, CookieSerializeOptions, parse, serialize } from 'cookie'
import { CookieObject } from '../definitions/interfaces.js'
import { tc } from '../functions/tc.js'

/**
 * Deserializes a cookie string to an object.
 */
export function deserializeCookie(cookie: string, options?: CookieParseOptions): CookieObject {
  let object: CookieObject | Error

  object = tc(() => parse(cookie, options))
  if (object instanceof Error) return {}

  return object
}

/**
 * Serializes a cookie name-value pair into a string suitable for use in a `Set-Cookie` header or `document.cookie` property.
 */
export function serializeCookie(key: string, value: string, options?: CookieSerializeOptions): string | Error {
  return tc(() => serialize(key, value, options))
}
