import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { APIMethod, WriteMode } from '../definitions/enums'
import { URLUtils } from '../utils/url.utils'
import { rc } from './rc'
import { Status } from './status'
import { tcp } from './tcp'

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
 * import { AxiosError, AxiosResponse } from 'axios'
 * import { ServiceAPI } from './service.api'
 *
 * interface Book {
 *   title: string
 * }
 *
 * async function getBooks(): Promise<Book[]> {
 *   let response: AxiosResponse<Book[]> | AxiosError
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
 * import { AxiosError, AxiosResponse } from 'axios'
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
 *       .then((v: AxiosResponse<Book[]> | AxiosError) => (v instanceof Error ? setError(v.code) : setBooks(v.data)))
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
 * @template T The configuration interface which extends the AxiosRequestConfig one
 * @template U The default Error interface
 */
export class API<T extends AxiosRequestConfig = AxiosRequestConfig, U = undefined> {
  /**
   * A string used as a prefix for all requests made by the instance.
   */
  readonly baseURL: string
  /**
   * A config based on the T interface.
   */
  readonly config: T
  /**
   * An AxiosInstance created with the baseURL and config variables.
   */
  readonly instance: AxiosInstance
  /**
   * A Status module initialized with a custom transformer.
   */
  readonly status: Status

  /**
   * @template T The configuration interface which extends the AxiosRequestConfig one.
   * @template U The default Error interface.
   */
  constructor(baseURL: string = '', config: T = API.dummyConfig) {
    this.baseURL = baseURL
    this.config = config
    this.instance = Axios.create({ baseURL: baseURL, ...config })
    this.status = new Status(API.defaultStatusTransformer)
  }

  /**
   * Performs a DELETE request.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async delete<V, W = U>(path: string, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<W>> {
    return this.handle<V, any, W>(APIMethod.DELETE, path, undefined, config)
  }

  /**
   * Performs a GET request.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async get<V, W = U>(path: string, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<W>> {
    return this.handle<V, any, W>(APIMethod.GET, path, undefined, config)
  }

  /**
   * Performs a POST request.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async post<V, W, X = U>(path: string, body?: W, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<X>> {
    return this.handle<V, W, X>(APIMethod.POST, path, body, config)
  }

  /**
   * Performs a PUT request.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async put<V, W, X = U>(path: string, body?: W, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<X>> {
    return this.handle<V, W, X>(APIMethod.PUT, path, body, config)
  }

  /**
   * Performs either a POST request if mode is CREATE or a PUT request if mode is UPDATE.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async write<V, W, X = U>(mode: WriteMode, path: string, body?: W, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<X>> {
    switch (mode) {
      case WriteMode.CREATE:
        return this.post(path, body, config)
      case WriteMode.UPDATE:
        return this.put(path, body, config)
    }
  }

  /** @internal */
  private async handle<V, W, X = U>(method: APIMethod, path: string, body?: W, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<X>> {
    let handled: boolean, response: AxiosResponse<V> | AxiosError<X>

    this.status.pending(method, path)

    handled = await this.handlePending(method, path, body, config)
    if (!handled) return rc(() => this.status.error(method, path), new Error() as AxiosError<X>)

    switch (method) {
      case APIMethod.DELETE:
        response = await tcp<AxiosResponse<V>, AxiosError<X>>(() => this.instance.delete<V>(path, config))
        break
      case APIMethod.GET:
        response = await tcp<AxiosResponse<V>, AxiosError<X>>(() => this.instance.get<V>(path, config))
        break
      case APIMethod.POST:
        response = await tcp<AxiosResponse<V>, AxiosError<X>>(() => this.instance.post<V>(path, body, config))
        break
      case APIMethod.PUT:
        response = await tcp<AxiosResponse<V>, AxiosError<X>>(() => this.instance.put<V>(path, body, config))
        break
    }

    if (response instanceof Error) {
      handled = await this.handleError(method, path, body, config, response)
      if (!handled) return rc(() => this.status.error(method, path), response)

      return rc(() => this.status.success(method, path), response)
    }

    handled = await this.handleSuccess(method, path, body, config, response)
    if (!handled) return rc(() => this.status.error(method, path), new Error() as AxiosError<X>)

    return rc(() => this.status.success(method, path), response)
  }

  /**
   * Called when any API call returns an Error.
   *
   * @template V The body interface.
   * @template W The error data interface, defaults to U.
   */
  async handleError<V, W = U>(method: APIMethod, path: string, body: V | undefined, config: T, error: AxiosError<W>): Promise<boolean> {
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
  async handleSuccess<V, W>(method: APIMethod, path: string, body: W | undefined, config: T, response: AxiosResponse<V>): Promise<boolean> {
    return true
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
