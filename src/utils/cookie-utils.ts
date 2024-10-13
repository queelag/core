import { ParseOptions, SerializeOptions, parse, serialize } from 'cookie'
import { CookieObject } from '../definitions/interfaces.js'
import { tc } from '../functions/tc.js'

/**
 * Deserializes a cookie string to an object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/cookie)
 */
export function deserializeCookie(cookie: string, options?: ParseOptions): CookieObject {
  let object: CookieObject | Error

  object = tc(() => parse(cookie, options))
  if (object instanceof Error) return {}

  return object
}

/**
 * Serializes a cookie name-value pair into a string suitable for use in a `Set-Cookie` header or `document.cookie` property.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/cookie)
 */
export function serializeCookie(key: string, value: string, options?: SerializeOptions): string | Error {
  return tc(() => serialize(key, value, options))
}
