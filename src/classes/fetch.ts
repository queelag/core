import { FetchRequestInit } from '../definitions/interfaces.js'
import { FetchRequestInfo } from '../definitions/types.js'
import { tcp } from '../functions/tcp.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { importNodeFetch, toLoggableNativeFetchRequestInit, toNativeFetchRequestInit, useNodeFetch } from '../utils/fetch-utils.js'
import { FetchError } from './fetch-error.js'
import { FetchResponse } from './fetch-response.js'

export class Fetch {
  static async handle<T, U, V>(input: FetchRequestInfo, init: FetchRequestInit<V> = {}): Promise<FetchResponse<T> | FetchError<U>> {
    let ninit: RequestInit, response: FetchResponse<T & U> | Error

    await useNodeFetch(await importNodeFetch())

    ninit = toNativeFetchRequestInit(init)
    ClassLogger.debug('Fetch', 'handle', `The request init has been parsed.`, toLoggableNativeFetchRequestInit(ninit))

    response = await tcp(async () => new FetchResponse(await fetch(input, ninit)))
    if (response instanceof Error) return FetchError.from(response)

    ClassLogger.debug('Fetch', 'handle', `The request has been sent.`, input)

    if (init.parse !== false) {
      await tcp(() => (response as FetchResponse<T & U>).parse())
    }

    if (response.ok === true) {
      return response
    }

    return FetchError.from(response)
  }

  static async connect<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, method: 'CONNECT' })
  }

  static async delete<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, body, method: 'DELETE' })
  }

  static async get<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, method: 'GET' })
  }

  static async head(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return this.handle(input, { ...init, method: 'HEAD' })
  }

  static async options<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, method: 'OPTIONS' })
  }

  static async patch<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, body, method: 'PATCH' })
  }

  static async post<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, body, method: 'POST' })
  }

  static async put<V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return this.handle(input, { ...init, body, method: 'PUT' })
  }

  static async trace(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return this.handle(input, { ...init, method: 'TRACE' })
  }
}
