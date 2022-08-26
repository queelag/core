import { CookieParseOptions, CookieSerializeOptions, parse, serialize } from 'cookie'
import { CookieObject } from '../definitions/interfaces'
import { tc } from '../functions/tc'

/**
 * Parse an HTTP Cookie header string and returning an object of all cookie
 * name-value pairs.
 */
export function deserializeCookie(cookie: string, options?: CookieParseOptions): CookieObject | Error {
  return tc(() => parse(cookie, options))
}

/**
 * Serialize a cookie name-value pair into a `Set-Cookie` header string.
 */
export function serializeCookie(key: string, value: string, options?: CookieSerializeOptions): string | Error {
  return tc(() => serialize(key, value, options))
}
