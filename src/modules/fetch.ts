import { FetchError } from '../classes/fetch.error.js'
import { FetchResponse } from '../classes/fetch.response.js'
import { RequestMethod } from '../definitions/enums.js'
import { FetchRequestInit } from '../definitions/interfaces.js'
import { FetchRequestInfo } from '../definitions/types.js'
import { tcp } from '../functions/tcp.js'
import { ModuleLogger } from '../loggers/module.logger.js'
import { toLoggableNativeFetchRequestInit, toNativeFetchRequestInit } from '../utils/fetch.utils.js'
import { Polyfill } from './polyfill.js'

/**
 * A module to use the native fetch in a more fashionable way.
 *
 * @category Module
 */
export class Fetch {
  /**
   * Performs any request.
   *
   * @template T The response data interface.
   * @template U The error data interface.
   * @template V The body interface.
   */
  static async handle<T, U, V>(input: FetchRequestInfo, init: FetchRequestInit<V> = {}): Promise<FetchResponse<T> | FetchError<U>> {
    let ninit: RequestInit, response: FetchResponse<T & U> | Error

    await Polyfill.blob()
    await Polyfill.fetch()
    await Polyfill.file()
    await Polyfill.formData()

    ninit = toNativeFetchRequestInit(init)
    ModuleLogger.debug('Fetch', 'handle', `The request init has been parsed.`, toLoggableNativeFetchRequestInit(ninit))

    response = await tcp(async () => new FetchResponse(await fetch(input, ninit)))
    if (response instanceof Error) return FetchError.from(response)

    ModuleLogger.debug('Fetch', 'handle', `The request has been sent.`, input)

    if (init.parse !== false) {
      await tcp(() => (response as FetchResponse<T & U>).parse())
    }

    if (response.ok === true) {
      return response
    }

    return FetchError.from(response)
  }

  /**
   * Performs a CONNECT request.
   *
   * @template T The response data interface.
   * @template U The error data interface.
   */
  static async connect<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, method: RequestMethod.CONNECT })
  }

  /**
   * Performs a DELETE request.
   *
   * @template T The response data interface.
   * @template U The error data interface.
   * @template V The body interface.
   */
  static async delete<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, body, method: RequestMethod.DELETE })
  }

  /**
   * Performs a GET request.
   *
   * @template T The response data interface.
   * @template U The error data interface.
   */
  static async get<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, method: RequestMethod.GET })
  }

  /**
   * Performs a HEAD request.
   */
  static async head(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return this.handle(input, { ...init, method: RequestMethod.HEAD })
  }

  /**
   * Performs a OPTIONS request.
   *
   * @template T The response data interface.
   * @template U The error data interface.
   */
  static async options<T, U>(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, method: RequestMethod.OPTIONS })
  }

  /**
   * Performs a PATCH request.
   *
   * @template T The response data interface.
   * @template U The error data interface.
   * @template V The body interface.
   */
  static async patch<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, body, method: RequestMethod.PATCH })
  }

  /**
   * Performs a POST request.
   *
   * @template T The response data interface.
   * @template U The error data interface.
   * @template V The body interface.
   */
  static async post<T, U, V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse<T> | FetchError<U>> {
    return this.handle(input, { ...init, body, method: RequestMethod.POST })
  }

  /**
   * Performs a PUT request.
   *
   * @template V The body interface.
   */
  static async put<V>(input: FetchRequestInfo, body?: V, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return this.handle(input, { ...init, body, method: RequestMethod.PUT })
  }

  /**
   * Performs a TRACE request.
   */
  static async trace(input: FetchRequestInfo, init: FetchRequestInit = {}): Promise<FetchResponse | FetchError> {
    return this.handle(input, { ...init, method: RequestMethod.TRACE })
  }
}
