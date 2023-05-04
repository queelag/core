import { FetchRequestInit } from '../definitions/interfaces.js'
import { isArray } from './array.utils.js'
import { deserializeFormData } from './form.data.utils.js'
import { mergeObjects, omitObjectProperties } from './object.utils.js'
import { isStringJSON } from './string.utils.js'

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

export function getFetchRequestInitHeadersLength<T>(init: FetchRequestInit<T> | RequestInit): number {
  return getFetchRequestInitHeadersEntries(init).length
}

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

export function setFetchRequestInitHeaderWhenUnset<T>(init: FetchRequestInit<T> | RequestInit, name: string, value: string): void {
  if (hasFetchRequestInitHeader(init, name)) {
    return
  }

  setFetchRequestInitHeader(init, name, value)
}

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

  if (getFetchRequestInitHeadersLength(merged) <= 0) {
    delete merged.headers
  }

  return merged
}

export function toNativeFetchRequestInit<T>(init: FetchRequestInit<T>): RequestInit {
  let clone: RequestInit

  clone = omitObjectProperties(init, ['body'])
  if (init.body === undefined) return clone

  if (init.body instanceof ArrayBuffer || init.body instanceof Blob) {
    clone.body = init.body
    setFetchRequestInitHeaderWhenUnset(clone, 'content-type', 'application/octet-stream')

    return clone
  }

  if (init.body instanceof FormData) {
    clone.body = init.body
    // this.setRequestInitHeaderOnlyIfUnset(clone, 'content-type', 'multipart/form-data')

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
    case 'object':
      clone.body = JSON.stringify(init.body)
      setFetchRequestInitHeaderWhenUnset(clone, 'content-type', 'application/json')

      break
  }

  return clone
}

export function toLoggableFetchRequestInit<T>(init: FetchRequestInit<T>): FetchRequestInit {
  let clone: FetchRequestInit

  clone = omitObjectProperties(init, ['body'])
  if (init.body === undefined) return clone

  if (init.body instanceof FormData) {
    clone.body = deserializeFormData(init.body)
  }

  return clone
}

export function toLoggableNativeFetchRequestInit(init: RequestInit): RequestInit {
  let clone: RequestInit

  clone = omitObjectProperties(init, ['body'])
  if (init.body === undefined) return clone

  if (init.body instanceof FormData) {
    clone.body = deserializeFormData(init.body) as BodyInit
    return clone
  }

  if (typeof init.body === 'string' && isStringJSON(init.body)) {
    clone.body = JSON.parse(init.body)
    return clone
  }

  clone.body = init.body

  return clone
}

export function hasFetchRequestInitHeader<T>(init: FetchRequestInit<T> | RequestInit, name: string): boolean {
  return getFetchRequestInitHeader(init, name) !== null
}
