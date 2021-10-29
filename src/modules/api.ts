import { FetchError } from '../classes/fetch.error'
import { FetchResponse } from '../classes/fetch.response'
import { APIMethod, WriteMode } from '../definitions/enums'
import { APIConfig, FetchRequestInit } from '../definitions/interfaces'
import { URLUtils } from '../utils/url.utils'
import { Fetch } from './fetch'
import { rc } from './rc'
import { Status } from './status'

/**
 * A module to smartly handle API calls and observe their status through the {@link Status} module.
 *
 * Initialization:
 *
 * ```typescript
 * import { API } from '@queelag/core'
 *
 * export const ServiceAPI: API = new API(
 *   'https://api.service.com',
 *   { headers: { authorization: 'Bearer token' } }
 * )
 * ```
 *
 * Usage:
 *
 * ```typescript
 * import { APIMethod, tcp } from '@queelag/core'
 * import { FetchError, FetchResponse } from 'axios'
 * import { ServiceAPI } from './service.api'
 *
 * interface Book {
 *   title: string
 * }
 *
 * async function getBooks(): Promise<Book[]> {
 *   let response: FetchResponse<Book[]> | FetchError
 *
 *   response = await tcp(() => ServiceAPI.get('books'))
 *   if (response instanceof Error) return []
 *
 *   return response.data
 * }
 * ```
 *
 * React + MobX Usage:
 *
 * ```typescript
 * import React, { Fragment, useEffect, useState } from 'react'
 * import { API, APIMethod } from '@queelag/core'
 * import { FetchError, FetchResponse } from 'axios'
 * import { makeObservable, observable, observer } from 'mobx'
 *
 * interface Book {
 *   title: string
 * }
 *
 * class ObservableAPI extends API {
 *   constructor() {
 *     super('https://api.service.com')
 *     makeObservable(this.status, { data: observable })
 *   }
 * }
 *
 * const ServiceAPI = new ObservableAPI()
 *
 * export const Books = observer(() => {
 *   const [books, setBooks] = useState<Book[]>([])
 *   const [error, setError] = useState<string>('')
 *
 *   useEffect(() => {
 *     ServiceAPI.get('books')
 *       .then((v: FetchResponse<Book[]> | FetchError) => (v instanceof Error ? setError(v.code) : setBooks(v.data)))
 *   }, [])
 *
 *   if (ServiceAPI.status.isPending(APIMethod.GET, 'books')) {
 *     return 'Loading'
 *   }
 *
 *   if (ServiceAPI.status.isSuccess(APIMethod.GET, 'books')) {
 *     return `Books: ${JSON.stringify(books, null, 2)}`
 *   }
 *
 *   if (ServiceAPI.status.isError(APIMethod.GET, 'books')) {
 *     return `Error: ${error}`
 *   }
 *
 *   return null
 * })
 * ```
 *
 * @category Module
 * @template T The configuration interface which extends the APIConfig one
 * @template U The default Error interface
 */
export class API<T extends FetchRequestInit = APIConfig, U = undefined> {
  /**
   * A string used as a prefix for all requests made by the instance.
   */
  readonly baseURL: string
  /**
   * A config based on the T interface.
   */
  readonly config: T
  /**
   * A Status module initialized with a custom transformer.
   */
  readonly status: Status

  /**
   * @template T The configuration interface which extends the APIConfig one.
   * @template U The default Error interface.
   */
  constructor(baseURL: string = '', config: T = API.dummyConfig) {
    this.baseURL = baseURL
    this.config = config
    this.status = new Status(API.defaultStatusTransformer)
  }

  /**
   * Performs a DELETE request.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async delete<V, W = U>(path: string, config: T = API.dummyConfig): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>(APIMethod.DELETE, path, undefined, config)
  }

  /**
   * Performs a GET request.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async get<V, W = U>(path: string, config: T = API.dummyConfig): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>(APIMethod.GET, path, undefined, config)
  }

  /**
   * Performs a PATCH request.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async patch<V, W, X = U>(path: string, body?: W, config: T = API.dummyConfig): Promise<FetchResponse<V> | FetchError<X>> {
    return this.handle<V, W, X>(APIMethod.PATCH, path, body, config)
  }

  /**
   * Performs a POST request.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async post<V, W, X = U>(path: string, body?: W, config: T = API.dummyConfig): Promise<FetchResponse<V> | FetchError<X>> {
    return this.handle<V, W, X>(APIMethod.POST, path, body, config)
  }

  /**
   * Performs a PUT request.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async put<V, W, X = U>(path: string, body?: W, config: T = API.dummyConfig): Promise<FetchResponse<V> | FetchError<X>> {
    return this.handle<V, W, X>(APIMethod.PUT, path, body, config)
  }

  /**
   * Performs either a POST request if mode is CREATE or a PUT request if mode is UPDATE.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async write<V, W, X = U>(mode: WriteMode, path: string, body?: W, config: T = API.dummyConfig): Promise<FetchResponse<V> | FetchError<X>> {
    switch (mode) {
      case WriteMode.CREATE:
        return this.post(path, body, config)
      case WriteMode.UPDATE:
        return this.put(path, body, config)
    }
  }

  /** @internal */
  private async handle<V, W, X = U>(method: APIMethod, path: string, body?: W, config: T = API.dummyConfig): Promise<FetchResponse<V> | FetchError<X>> {
    let handled: boolean, response: FetchResponse<V> | FetchError<X>

    this.setCallStatus(method, path, config, Status.PENDING)

    handled = await this.handlePending(method, path, body, config)
    if (!handled) return rc(() => this.setCallStatus(method, path, config, Status.ERROR), new Error() as FetchError<X>)

    response = await Fetch.handle(URLUtils.concat(this.baseURL, path), { method })
    if (response instanceof Error) {
      handled = await this.handleError(method, path, body, config, response)
      if (!handled) return rc(() => this.setCallStatus(method, path, config, Status.ERROR), response)

      return rc(() => this.setCallStatus(method, path, config, Status.SUCCESS), response)
    }

    handled = await this.handleSuccess(method, path, body, config, response)
    if (!handled) return rc(() => this.setCallStatus(method, path, config, Status.ERROR), new Error() as FetchError<X>)

    return rc(() => this.setCallStatus(method, path, config, Status.SUCCESS), response)
  }

  /**
   * Called when any API call returns an Error.
   *
   * @template V The body interface.
   * @template W The error data interface, defaults to U.
   */
  async handleError<V, W = U>(method: APIMethod, path: string, body: V | undefined, config: T, error: FetchError<W>): Promise<boolean> {
    return false
  }

  /**
   * Called when any API call has started.
   *
   * @template V The body interface.
   */
  async handlePending<V>(method: APIMethod, path: string, body: V | undefined, config: T): Promise<boolean> {
    return true
  }

  /**
   * Called when any API call returns an Error.
   *
   * @template V The response data interface.
   * @template W The body interface.
   */
  async handleSuccess<V, W>(method: APIMethod, path: string, body: W | undefined, config: T, response: FetchResponse<V>): Promise<boolean> {
    return true
  }

  private setCallStatus(method: APIMethod, path: string, config: T, status: string): void {
    if (this.isConfigStatusSettable(config, status)) {
      this.status.set([method, path], status)
    }
  }

  private isConfigStatusSettable(config: APIConfig, status: string): boolean {
    return config.status?.blacklist ? !config.status.blacklist.includes(status) : config.status?.whitelist ? config.status.whitelist.includes(status) : true
  }

  /** @internal */
  static get defaultStatusTransformer(): (keys: string[]) => string {
    return (keys: string[]) => keys[0] + '_' + URLUtils.removeSearchParams(keys[1])
  }

  /** @internal */
  static get dummyConfig(): any {
    return {}
  }
}
