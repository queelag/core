import { FetchRequestInit } from '../definitions/interfaces'
import { Environment } from '../modules/environment'
import { FormDataUtils } from '../utils/form.data.utils'
import { ObjectUtils } from './object.utils'

/**
 * Utils for anything related to fetch.
 *
 * @category Utility
 */
export class FetchUtils {
  static setRequestInitHeader<V extends unknown>(init: FetchRequestInit<V> | RequestInit, name: string, value: string): void {
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

  static setRequestInitHeaderOnlyIfUnset<V extends unknown>(init: FetchRequestInit<V> | RequestInit, name: string, value: string): void {
    if (this.hasRequestInitHeader(init, name)) {
      return
    }

    this.setRequestInitHeader(init, name, value)
  }

  static mergeRequestInits<V extends unknown>(target: FetchRequestInit<V>, ...sources: FetchRequestInit<V>[]): FetchRequestInit<V> {
    let merged: FetchRequestInit<V>

    merged = ObjectUtils.merge(target, ...sources)
    merged.headers = target.headers ? ObjectUtils.clone(target.headers) : new Headers()

    sources.forEach((v: FetchRequestInit<V>) => {
      switch (typeof v.headers?.entries) {
        case 'function':
          ;[...v.headers.entries()].forEach(([k, v]: [number, string[]] | [string, string]) => {
            switch (typeof v) {
              case 'object':
                this.setRequestInitHeader(merged, v[0], v[1])
                break
              case 'string':
                this.setRequestInitHeader(merged, k as string, v)
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

  static toNativeRequestInit<V extends unknown>(init: FetchRequestInit<V>): RequestInit {
    let clone: RequestInit

    clone = ObjectUtils.omit(init, ['body'])
    if (!init.body) return clone

    switch (true) {
      case init.body instanceof ArrayBuffer:
      case Environment.isBlobDefined && init.body instanceof Blob:
        clone.body = init.body as ArrayBuffer | Blob
        this.setRequestInitHeaderOnlyIfUnset(clone, 'content-type', 'application/octet-stream')

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
            this.setRequestInitHeaderOnlyIfUnset(clone, 'content-type', 'text/plain')

            break
          case 'object':
            clone.body = JSON.stringify(init.body)
            this.setRequestInitHeaderOnlyIfUnset(clone, 'content-type', 'application/json')

            break
          case 'undefined':
            break
        }

        break
    }

    return clone
  }

  static toLoggableRequestInit<T>(init: FetchRequestInit<T>): FetchRequestInit<T> {
    let clone: FetchRequestInit<T>

    clone = ObjectUtils.omit(init, ['body'])
    if (!init.body) return clone

    switch (true) {
      case Environment.isFormDataDefined && init.body instanceof FormData:
        clone.body = FormDataUtils.toObject(init.body as any) as any
        break
    }

    return clone
  }

  static toLoggableNativeRequestInit(init: RequestInit): RequestInit {
    let clone: RequestInit

    clone = ObjectUtils.omit(init, ['body'])
    if (!init.body) return clone

    switch (true) {
      case Environment.isFormDataDefined && init.body instanceof FormData:
        clone.body = FormDataUtils.toObject(init.body as FormData) as any
        break
    }

    return clone
  }

  static hasRequestInitHeader<V extends unknown>(init: FetchRequestInit<V> | RequestInit, name: string): boolean {
    switch (typeof init.headers?.keys) {
      case 'function':
        return [...init.headers?.keys()].includes(name)
      case 'string':
        return init.headers.keys.includes(name)
      case 'undefined':
        return false
    }
  }
}
