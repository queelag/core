import { FetchError } from '../classes/fetch.error'
import { FetchResponse } from '../classes/fetch.response'
import { RequestMethod } from '../definitions/enums'
import { FetchRequestInit } from '../definitions/interfaces'
import { FetchRequestInfo } from '../definitions/types'
import { FetchUtils } from '../utils/fetch.utils'
import { Environment } from './environment'
import { tcp } from './tcp'

/**
 * Use node-fetch on node environments.
 */
if (Environment.isWindowNotDefined) {
  const Blob = Environment.require('fetch-blob')
  const fetch = Environment.require('node-fetch')

  global.fetch = fetch
  global.Blob = Blob
  global.Headers = fetch.Headers
  global.Request = fetch.Request
  global.Response = fetch.Response
}

/**
 * A module to use the native fetch in a more fashionable way.
 *
 * Usage:
 *
 * ```typescript
 * import { Fetch, FetchError, FetchResponse, RequestMethod, tcp } from '@queelag/core'
 *
 * interface Book {
 *   title: string
 * }
 *
 * interface GetBookError {
 *   message: string
 * }
 *
 * async function getBooks(): Promise<Book[]> {
 *   let response: FetchResponse<Book[]> | FetchError<GetBookError>
 *
 *   response = await Fetch.get('https://somewhere.com/books')
 *   if (response instanceof Error) {
 *     console.error(response.response.data.message)
 *     return []
 *   }
 *
 *   return response.data
 * }
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
    let response: FetchResponse<T & U> | Error, parsed: void | Error

    response = await tcp(async () => new FetchResponse(await fetch(input, await FetchUtils.toRequestInit(init))))
    if (response instanceof Error) return FetchError.from(response)

    parsed = await tcp(() => (response as FetchResponse<T & U>).parse())
    if (parsed instanceof Error) return FetchError.from(parsed)

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
