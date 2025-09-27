import type {
  AppendSearchParamsToURLParams,
  DeserializeURLSearchParamsInit,
  DeserializeURLSearchParamsType,
  SerializeURLSearchParamsInit,
  URLSearchParamsRecord
} from '../definitions/types.js'
import { tc } from '../functions/tc.js'
import { isArray } from './array-utils.js'
import { joinPaths } from './path-utils.js'

/**
 * Appends the search params to a URL.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/url)
 */
export function appendSearchParamsToURL<T extends URLSearchParamsRecord>(url: string, params: AppendSearchParamsToURLParams<T>, base?: string | URL): string
export function appendSearchParamsToURL<T extends URLSearchParamsRecord>(url: URL, params: AppendSearchParamsToURLParams<T>, base?: string | URL): URL
export function appendSearchParamsToURL<T extends URLSearchParamsRecord>(
  url: string | URL,
  params: AppendSearchParamsToURLParams<T>,
  base?: string | URL
): string | URL {
  let u: URL

  if (isNotURL(url, base)) {
    return url
  }

  u = new URL(url, base)
  u.search = serializeURLSearchParams({
    ...deserializeURLSearchParams(u.searchParams),
    ...deserializeURLSearchParams(params)
  }).toString()

  return typeof url === 'string' ? u.toString() : u
}

/**
 * Concatenates an URL with pathnames.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/url)
 */
export function concatURL(url: string, ...pathnames: Partial<string>[]): string
export function concatURL(url: URL, ...pathnames: Partial<string>[]): URL
export function concatURL(url: string | URL, ...pathnames: Partial<string>[]): string | URL {
  let u: URL

  if (isNotURL(url)) {
    return joinPaths(url.toString(), ...pathnames)
  }

  u = new URL(url)

  for (let pathname of pathnames) {
    u = new URL(pathname, u)
  }

  return typeof url === 'string' ? u.toString() : u
}

/**
 * Deserializes an array, string, plain object or `URLSearchParams` to an array, string or plain object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/url)
 */
export function deserializeURLSearchParams<T extends URLSearchParamsRecord>(params: DeserializeURLSearchParamsInit): T
export function deserializeURLSearchParams<T extends URLSearchParamsRecord>(params: DeserializeURLSearchParamsInit, type: 'string'): string
export function deserializeURLSearchParams<T extends URLSearchParamsRecord>(params: DeserializeURLSearchParamsInit, type: 'array'): string[][]
export function deserializeURLSearchParams<T extends URLSearchParamsRecord>(params: DeserializeURLSearchParamsInit, type: 'object'): T
export function deserializeURLSearchParams<T extends URLSearchParamsRecord>(
  params: DeserializeURLSearchParamsInit,
  type: DeserializeURLSearchParamsType = 'object'
): string | string[][] | T {
  switch (type) {
    case 'array':
      return [...new URLSearchParams(params).entries()]
    case 'object': {
      let record: T = {} as T

      for (let [k, v] of new URLSearchParams(params).entries()) {
        record[k as keyof T] = v as T[keyof T]
      }

      return record
    }
    case 'string':
      return new URLSearchParams(params).toString()
  }
}

/**
 * Removes the search params from an URL.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/url)
 */
export function removeSearchParamsFromURL(url: string): string
export function removeSearchParamsFromURL(url: URL): URL
export function removeSearchParamsFromURL(url: string | URL): string | URL {
  let u: URL

  if (isNotURL(url)) {
    return url
  }

  u = new URL(url)
  u.search = ''

  return typeof url === 'string' ? u.toString() : u
}

/**
 * Serializes an array, string or plain object to `URLSearchParams`.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/url)
 */
export function serializeURLSearchParams<T extends object>(params: SerializeURLSearchParamsInit<T>): URLSearchParams {
  switch (typeof params) {
    case 'string':
      return new URLSearchParams(params)
    case 'object': {
      let record: URLSearchParamsRecord = {}

      if (params instanceof URLSearchParams) {
        return params
      }

      if (isArray(params)) {
        return new URLSearchParams(params)
      }

      for (let [k, v] of Object.entries(params)) {
        switch (typeof v) {
          case 'bigint':
          case 'boolean':
          case 'number':
            record[k] = v.toString()
            continue
          case 'function':
          case 'symbol':
          case 'undefined':
            continue
          case 'object':
            if (isArray(v)) {
              record[k] = v.join(',')
            }

            continue
          case 'string':
            record[k] = v
            continue
        }
      }

      return new URLSearchParams(record)
    }
    default:
      return new URLSearchParams()
  }
}

/**
 * Checks if an unknown value is a URL.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/url)
 */
export function isURL(value: unknown, base?: string | URL): boolean {
  let url: URL | TypeError

  if (value instanceof URL) {
    return true
  }

  url = tc(() => new URL(String(value), base), false)
  if (!(url instanceof URL)) return false

  return true
}

/**
 * Checks if an unknown value is not a URL.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/url)
 */
export function isNotURL(value: unknown, base?: string | URL): boolean {
  return !isURL(value, base)
}
