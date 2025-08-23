import { FetchRequestInit } from '../definitions/interfaces.js'
import { FetchRequestInfo } from '../definitions/types.js'
import { tcp } from '../functions/tcp.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { toLoggableNativeFetchRequestInit, toNativeFetchRequestInit } from '../utils/fetch-utils.js'
import { FetchError } from './fetch-error.js'
import { FetchResponse } from './fetch-response.js'

/**
 * The Fetch class is built on top of the native Fetch API and it is isomorphic, which means that it can be used in both Node.js and browsers.
 *
 * - The body and headers of the request are automatically generated based on the body.
 * - The body of the response is dynamically parsed based on the Content-Type header, unless the parse option is set to false.
 * - Enabling logs will give you a detailed overview of the requests and responses.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/fetch)
 */
export class Fetch {
  /**
   * Sends a request.
   */
  static async send<T, U, V>(input: FetchRequestInfo, init: FetchRequestInit<V> = {}): Promise<FetchResponse<T> | FetchError<U>> {
    let ninit: RequestInit, response: FetchResponse<T & U> | Error

    ninit = toNativeFetchRequestInit(init)
    ClassLogger.debug('Fetch', 'handle', `The request init has been parsed.`, toLoggableNativeFetchRequestInit(ninit, init.logNativeOptions))

    response = await tcp(async () => new FetchResponse(await fetch(input, ninit)))
    if (response instanceof Error) return FetchError.from(response)

    ClassLogger.debug('Fetch', 'handle', `The request has been sent.`, input)

    if (init.decode !== false) {
      await tcp(() => (response as FetchResponse<T & U>).decode(typeof init.decode === 'object' ? init.decode : undefined))
    }

    if (response.ok === true) {
      return response
    }

    return FetchError.from(response)
  }

  /**
   * Sends a CONNECT request.
   */
  static async connect<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return Fetch.send(input, { ...init, method: 'CONNECT' })
  }

  /**
   * Sends a DELETE request.
   */
  static async delete<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return Fetch.send(input, { ...init, body, method: 'DELETE' })
  }

  /**
   * Sends a GET request.
   */
  static async get<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return Fetch.send(input, { ...init, method: 'GET' })
  }

  /**
   * Sends a HEAD request.
   */
  static async head(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return Fetch.send(input, { ...init, method: 'HEAD' })
  }

  /**
   * Sends a OPTIONS request.
   */
  static async options<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return Fetch.send(input, { ...init, method: 'OPTIONS' })
  }

  /**
   * Sends a PATCH request.
   */
  static async patch<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return Fetch.send(input, { ...init, body, method: 'PATCH' })
  }

  /**
   * Sends a POST request.
   */
  static async post<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return Fetch.send(input, { ...init, body, method: 'POST' })
  }

  /**
   * Sends a PUT request.
   */
  static async put<V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return Fetch.send(input, { ...init, body, method: 'PUT' })
  }

  /**
   * Sends a TRACE request.
   */
  static async trace(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return Fetch.send(input, { ...init, method: 'TRACE' })
  }
}
