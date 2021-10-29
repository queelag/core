import { FetchError } from '../classes/fetch.error'
import { FetchResponse } from '../classes/fetch.response'
import { APIMethod } from '../definitions/enums'
import { FetchRequestInit } from '../definitions/interfaces'
import { FetchRequestInfo } from '../definitions/types'
import { ObjectUtils } from '../utils/object.utils'
import { tcp } from './tcp'

export class Fetch {
  static async handle<T, U, V>(input: FetchRequestInfo, init: FetchRequestInit<V> = {}): Promise<FetchResponse<T> | FetchError<U>> {
    let response: FetchResponse<T & U> | Error, parsed: void | Error

    response = await tcp(async () => new FetchResponse(await fetch(input, await this.toRequestInit(init))))
    if (response instanceof Error) return new FetchError(response)

    parsed = await tcp(() => (response as FetchResponse<T & U>).parse())
    if (parsed instanceof Error) return new FetchError(parsed)

    if (response.status >= 200 && response.status <= 299) {
      return response
    }

    return new FetchError(new Error('The status code is not in the range 200-299.'), response)
  }

  static async connect<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, method: APIMethod.CONNECT })
  }

  static async delete<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, body, method: APIMethod.DELETE })
  }

  static async get<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, method: APIMethod.GET })
  }

  static async head(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return this.handle(input, { ...init, method: APIMethod.HEAD })
  }

  static async options<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, method: APIMethod.OPTIONS })
  }

  static async patch<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, body, method: APIMethod.PATCH })
  }

  static async post<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, body, method: APIMethod.POST })
  }

  static async put<U>(input: FetchRequestInfo, body?: U, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return this.handle(input, { ...init, body, method: APIMethod.PUT })
  }

  static async trace(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return this.handle(input, { ...init, method: APIMethod.TRACE })
  }

  static setRequestInitHeaderOnlyIfUnset<V>(init: FetchRequestInit<V>, name: string, value: string): void {
    switch (true) {
      case init.headers instanceof Headers:
        let headers: Headers

        headers = init.headers as Headers
        if (headers.has(name)) return

        headers.set(name, value)
        break
      case Array.isArray(init.headers):
        let array: string[][]

        array = init.headers as string[][]
        if (array.some((v: string[]) => v[0] === name)) return

        array.push([name, value])
        break
      case typeof init.headers === 'object':
        let record: Record<string, string>

        record = init.headers as Record<string, string>
        if (record[name]) return

        record[name] = value
        break
    }
  }

  static async toRequestInit<V extends unknown>(init: FetchRequestInit<V>): Promise<RequestInit> {
    let clone: RequestInit

    clone = ObjectUtils.omit(init, ['body'])
    if (!init.body) return clone

    switch (true) {
      case init.body instanceof ArrayBuffer:
      case init.body instanceof Blob:
        clone.body = init.body as ArrayBuffer | Blob
        this.setRequestInitHeaderOnlyIfUnset(init, 'content-type', 'application/octet-stream')

        break
      case init.body instanceof FormData:
        clone.body = init.body as FormData
        this.setRequestInitHeaderOnlyIfUnset(init, 'content-type', 'multipart/form-data')

        break
    }

    switch (typeof init.body) {
      case 'bigint':
      case 'boolean':
      case 'function':
      case 'number':
      case 'string':
      case 'symbol':
        clone.body = init.body.toString()
        this.setRequestInitHeaderOnlyIfUnset(init, 'content-type', 'text/plain')

        break
      case 'object':
        clone.body = JSON.stringify(init.body)
        this.setRequestInitHeaderOnlyIfUnset(init, 'content-type', 'application/json')

        break
      case 'undefined':
        break
    }

    return clone
  }
}
