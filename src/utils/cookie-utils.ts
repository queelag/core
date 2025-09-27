import { type ParseOptions, type SerializeOptions, parse, serialize } from 'cookie'
import type { CookieObject } from '../definitions/interfaces.js'
import type { CookieObjectValue } from '../definitions/types.js'
import { tc } from '../functions/tc.js'
import { isPlainObject } from './object-utils.js'
import { isStringBigInt, isStringBoolean, isStringJSON, isStringNumber } from './string-utils.js'

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/cookie)
 */
export function deserializeCookie(cookie: string, options?: ParseOptions): CookieObject | Error {
  let object: Record<string, string | undefined> | Error, out: CookieObject

  object = tc(() => parse(cookie, options))
  if (object instanceof Error) return object

  out = {}

  for (let [k, v] of Object.entries(object)) {
    out[k] = deserializeCookieValue(v)
  }

  return out
}

/**
 * Deserializes a cookie value into its original type.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/cookie)
 */
export function deserializeCookieValue(value: string | undefined): CookieObjectValue | undefined {
  if (typeof value === 'undefined') {
    return undefined
  }

  switch (true) {
    case isStringBigInt(value):
      return BigInt(value)
    case isStringBoolean(value):
      return value === String(true)
    case isStringNumber(value):
      return Number(value)
    case isStringJSON(value):
      return JSON.parse(value)
  }

  return value
}

/**
 * Serializes a cookie name-value pair into a string suitable for use in a `Set-Cookie` header or `document.cookie` property.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/cookie)
 */
export function serializeCookie(name: string, value: unknown, options?: SerializeOptions): string | Error {
  let val: string | Error

  val = serializeCookieValue(value)
  if (val instanceof Error) return val

  return tc(() => serialize(name, val, options))
}

/**
 * Serializes a cookie value into a string.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/cookie)
 */
export function serializeCookieValue(value: unknown): string | Error {
  switch (typeof value) {
    case 'bigint':
      return String(value)
    case 'boolean':
    case 'number':
    case 'string':
      return String(value)
    case 'function':
    case 'symbol':
      return new Error(`The value cannot be a ${typeof value}.`)
    case 'object':
      if (isPlainObject(value)) {
        return JSON.stringify(value)
      }

      return ''
    case 'undefined':
      return ''
  }
}
