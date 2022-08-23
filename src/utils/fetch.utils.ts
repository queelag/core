import { FetchRequestInit } from '../definitions/interfaces'
import { Environment } from '../modules/environment'
import { convertFormDataToObject } from '../utils/form.data.utils'
import { cloneDeepObject, mergeObjects, omitObjectProperties } from './object.utils'
import { isStringJSON } from './string.utils'

export function setFetchRequestInitHeader<T extends unknown>(init: FetchRequestInit<T> | RequestInit, name: string, value: string): void {
  switch (true) {
    case init.headers instanceof Headers:
      ;(init.headers as Headers).set(name, value)
      break
    case Array.isArray(init.headers):
      ;(init.headers as string[][]).push([name, value])
      break
    case typeof init.headers === 'object':
      ;(init.headers as Record<string, string>)[name] = value
      break
    case typeof init.headers === 'undefined':
      init.headers = new Headers()
      init.headers.set(name, value)

      break
  }
}

export function setFetchRequestInitHeaderWhenUnset<V extends unknown>(init: FetchRequestInit<V> | RequestInit, name: string, value: string): void {
  if (hasFetchRequestInitHeader(init, name)) {
    return
  }

  setFetchRequestInitHeader(init, name, value)
}

export function mergeFetchRequestInits<V extends unknown>(target: FetchRequestInit<V>, ...sources: FetchRequestInit<V>[]): FetchRequestInit<V> {
  let merged: FetchRequestInit<V>

  merged = mergeObjects(target, ...sources)
  merged.headers = target.headers ? cloneDeepObject(target.headers) : new Headers()

  sources.forEach((v: FetchRequestInit<V>) => {
    switch (typeof v.headers?.entries) {
      case 'function':
        ;[...v.headers.entries()].forEach(([k, v]: [number, string[]] | [string, string]) => {
          switch (typeof v) {
            case 'object':
              setFetchRequestInitHeader(merged, v[0], v[1])
              break
            case 'string':
              setFetchRequestInitHeader(merged, k as string, v)
              break
          }
        })

        break
      case 'undefined':
        break
    }
  })

  if (typeof merged.headers.entries === 'function' && [...merged.headers.entries()].length <= 0) {
    delete merged.headers
  }

  return merged
}

export function toNativeFetchRequestInit<V extends unknown>(init: FetchRequestInit<V>): RequestInit {
  let clone: RequestInit

  clone = omitObjectProperties(init, ['body'])
  if (!init.body) return clone

  switch (true) {
    case init.body instanceof ArrayBuffer:
    case Environment.isBlobDefined && init.body instanceof Blob:
      clone.body = init.body as ArrayBuffer | Blob
      setFetchRequestInitHeaderWhenUnset(clone, 'content-type', 'application/octet-stream')

      break
    case Environment.isFormDataDefined && init.body instanceof FormData:
      clone.body = init.body as FormData
      // this.setRequestInitHeaderOnlyIfUnset(clone, 'content-type', 'multipart/form-data')

      break
    default:
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
        case 'undefined':
          break
      }

      break
  }

  return clone
}

export function toLoggableFetchRequestInit<T>(init: FetchRequestInit<T>): FetchRequestInit<T> {
  let clone: FetchRequestInit<T>

  clone = omitObjectProperties(init, ['body'])
  if (!init.body) return clone

  switch (true) {
    case Environment.isFormDataDefined && init.body instanceof FormData:
      clone.body = convertFormDataToObject(init.body as any) as any
      break
  }

  return clone
}

export function toLoggableNativeFetchRequestInit(init: RequestInit): RequestInit {
  let clone: RequestInit

  clone = omitObjectProperties(init, ['body'])
  if (!init.body) return clone

  switch (true) {
    case Environment.isFormDataDefined && init.body instanceof FormData:
      clone.body = convertFormDataToObject(init.body as FormData) as any
      break
    default:
      switch (typeof init.body) {
        case 'string':
          if (isStringJSON(init.body)) {
            clone.body = JSON.parse(init.body)
            break
          }

          clone.body = init.body
          break
        default:
          clone.body = init.body
          break
      }
      break
  }

  return clone
}

export function hasFetchRequestInitHeader<V extends unknown>(init: FetchRequestInit<V> | RequestInit, name: string): boolean {
  switch (typeof init.headers?.keys) {
    case 'function':
      return [...init.headers?.keys()].includes(name)
    case 'string':
      return init.headers.keys.includes(name)
    case 'undefined':
      return false
  }
}
