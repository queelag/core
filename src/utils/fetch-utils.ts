import { FetchRequestInit, ToLoggableFetchRequestInitOptions, ToLoggableNativeFetchRequestInitOptions } from '../definitions/interfaces.js'
import { isArray } from './array-utils.js'
import { deserializeFormData } from './form-data-utils.js'
import { decodeJSON, encodeJSON } from './json-utils.js'
import { mergeObjects, omitObjectProperties } from './object-utils.js'
import { isStringJSON } from './string-utils.js'
import { deserializeURLSearchParams } from './url-utils.js'

/**
 * Counts the number of headers in a `FetchRequestInit` or `RequestInit` object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function countFetchRequestInitHeaders<T>(init: FetchRequestInit<T> | RequestInit): number {
  return getFetchRequestInitHeadersEntries(init).length
}

/**
 * Deletes a header from a `FetchRequestInit` or `RequestInit` object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function deleteFetchRequestInitHeader<T>(init: FetchRequestInit<T> | RequestInit, name: string): void {
  if (typeof init.headers === 'undefined') {
    return
  }

  if (init.headers instanceof Headers) {
    return init.headers.delete(name)
  }

  if (isArray(init.headers)) {
    init.headers = init.headers.filter((header: string[]) => header[0] !== name)
    return
  }

  delete init.headers[name]
}

/**
 * Returns a header from a `FetchRequestInit` or `RequestInit` object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function getFetchRequestInitHeader<T>(init: FetchRequestInit<T> | RequestInit, name: string): string | null {
  let value: string | undefined

  if (typeof init.headers === 'undefined') {
    return null
  }

  if (init.headers instanceof Headers) {
    return init.headers.get(name)
  }

  if (isArray(init.headers)) {
    let duplet: string[] | undefined

    duplet = init.headers.find((v: string[]) => v[0] === name)
    if (!duplet) return null

    return duplet[1]
  }

  value = init.headers[name]
  if (!value) return null

  return value
}

/**
 * Returns the headers entries from a `FetchRequestInit` or `RequestInit` object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function getFetchRequestInitHeadersEntries<T>(init: FetchRequestInit<T> | RequestInit): string[][] {
  if (typeof init.headers === 'undefined') {
    return []
  }

  if (init.headers instanceof Headers) {
    return [...init.headers.entries()]
  }

  if (isArray(init.headers)) {
    return init.headers
  }

  return Object.entries(init.headers)
}

/**
 * Merges two or more `FetchRequestInit` or `RequestInit` objects.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function mergeFetchRequestInits<T>(target: FetchRequestInit<T>, ...sources: FetchRequestInit<T>[]): FetchRequestInit<T> {
  let merged: FetchRequestInit<T>

  merged = mergeObjects(target, ...sources)
  merged.headers = new Headers()

  for (let [k, v] of getFetchRequestInitHeadersEntries(target)) {
    setFetchRequestInitHeader(merged, k, v)
  }

  for (let source of sources) {
    for (let [k, v] of getFetchRequestInitHeadersEntries(source)) {
      setFetchRequestInitHeader(merged, k, v)
    }
  }

  if (countFetchRequestInitHeaders(merged) <= 0) {
    delete merged.headers
  }

  return merged
}

/**
 * Sets a header in a `FetchRequestInit` or `RequestInit` object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function setFetchRequestInitHeader<T>(init: FetchRequestInit<T> | RequestInit, name: string, value: string): void {
  if (typeof init.headers === 'undefined') {
    init.headers = new Headers()
    init.headers.set(name, value)

    return
  }

  if (init.headers instanceof Headers) {
    return init.headers.set(name, value)
  }

  if (isArray(init.headers)) {
    init.headers = init.headers.filter((header: string[]) => header[0] !== name)
    init.headers.push([name, value])

    return
  }

  init.headers[name] = value
}

/**
 * Sets a header a `FetchRequestInit` or `RequestInit` object if it is not set.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function setFetchRequestInitHeaderWhenUnset<T>(init: FetchRequestInit<T> | RequestInit, name: string, value: string): void {
  if (hasFetchRequestInitHeader(init, name)) {
    return
  }

  setFetchRequestInitHeader(init, name, value)
}

/**
 * Returns a version of a `FetchRequestInit` object that is easier to read in logs.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function toLoggableFetchRequestInit<T>(init: FetchRequestInit<T>, options?: ToLoggableFetchRequestInitOptions): FetchRequestInit {
  let clone: FetchRequestInit

  clone = omitObjectProperties(init, ['body'])
  if (init.body === undefined) return clone

  if (init.body instanceof FormData) {
    clone.body = deserializeFormData(init.body, options?.deserializeFormData)
    return clone
  }

  if (init.body instanceof URLSearchParams) {
    clone.body = deserializeURLSearchParams(init.body, options?.deserializeURLSearchParamsType as any)
    return clone
  }

  clone.body = init.body

  return clone
}

/**
 * Returns a version of a `RequestInit` object that is easier to read in logs.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function toLoggableNativeFetchRequestInit(init: RequestInit, options?: ToLoggableNativeFetchRequestInitOptions): RequestInit {
  let clone: RequestInit

  clone = omitObjectProperties(init, ['body'])
  if (init.body === undefined) return clone

  if (init.headers) {
    clone.headers = getFetchRequestInitHeadersEntries(init) as HeadersInit
  }

  if (init.body instanceof FormData) {
    clone.body = deserializeFormData(init.body, options?.deserializeFormData) as BodyInit
    return clone
  }

  if (init.body instanceof URLSearchParams) {
    clone.body = deserializeURLSearchParams(init.body, options?.deserializeURLSearchParamsType as any) as any
    return clone
  }

  if (typeof init.body === 'string' && isStringJSON(init.body)) {
    clone.body = decodeJSON<any>(init.body, options?.decodeJSON)
    return clone
  }

  clone.body = init.body

  return clone
}

/**
 * Converts a `FetchRequestInit` object to a `RequestInit` object.
 * Sets the `content-type` header based on the type of the body.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function toNativeFetchRequestInit<T>(init: FetchRequestInit<T>): RequestInit {
  let clone: RequestInit

  clone = omitObjectProperties(init, ['body']) as RequestInit
  if (init.body === undefined) return clone

  if (init.body instanceof ArrayBuffer || init.body instanceof Blob || init.body instanceof Uint8Array) {
    clone.body = init.body
    setFetchRequestInitHeaderWhenUnset(clone, 'content-type', 'application/octet-stream')

    return clone
  }

  if (init.body instanceof FormData) {
    clone.body = init.body
    // setFetchRequestInitHeaderWhenUnset(clone, 'content-type', 'multipart/form-data')

    return clone
  }

  if (init.body instanceof URLSearchParams) {
    clone.body = init.body
    setFetchRequestInitHeaderWhenUnset(clone, 'content-type', 'application/x-www-form-urlencoded')

    return clone
  }

  switch (typeof init.body) {
    case 'bigint':
    case 'boolean':
    case 'function':
    case 'number':
    case 'string':
    case 'symbol':
      clone.body = init.body.toString()
      setFetchRequestInitHeaderWhenUnset(clone, 'content-type', 'text/plain')

      break
    case 'object': {
      let body: string | Error

      body = encodeJSON(init.body, typeof init.encode === 'object' ? init.encode.json : undefined)
      if (body instanceof Error) break

      clone.body = body
      setFetchRequestInitHeaderWhenUnset(clone, 'content-type', 'application/json')

      break
    }
  }

  return clone
}

/**
 * Checks if a `FetchRequestInit` or `RequestInit` object has a header.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/fetch)
 */
export function hasFetchRequestInitHeader<T>(init: FetchRequestInit<T> | RequestInit, name: string): boolean {
  return getFetchRequestInitHeader(init, name) !== null
}
