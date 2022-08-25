import { FetchError } from '../classes/fetch.error'
import { FetchResponse } from '../classes/fetch.response'
import { DEFAULT_API_STATUS_TRANSFORMER, EMPTY_OBJECT } from '../definitions/constants'
import { RequestMethod, WriteMode } from '../definitions/enums'
import { APIConfig } from '../definitions/interfaces'
import { rc } from '../functions/rc'
import { mergeFetchRequestInits } from '../utils/fetch.utils'
import { convertQueryParametersObjectToString } from '../utils/query.parameters.utils'
import { appendSearchParamsToURL, concatURL } from '../utils/url.utils'
import { Fetch } from './fetch'
import { Polyfill } from './polyfill'
import { Status } from './status'

/**
 * A module to smartly handle API calls and observe their status through the {@link Status} module.
 *
 * @category Module
 * @template T The configuration interface which extends the {@link APIConfig} one
 * @template U The default Error interface
 */
export class API<T extends APIConfig = APIConfig, U = undefined> {
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
   * @template T The configuration interface which extends the {@link APIConfig} one.
   * @template U The default Error interface.
   */
  constructor(baseURL: string = '', config: T = EMPTY_OBJECT()) {
    this.baseURL = baseURL
    this.config = config
    this.status = new Status(DEFAULT_API_STATUS_TRANSFORMER)
  }

  /**
   * Performs any request.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async handle<V, W, X = U>(method: RequestMethod, path: string, body?: W, config: T = EMPTY_OBJECT()): Promise<FetchResponse<V> | FetchError<X>> {
    let tbody: W | undefined, query: string, handled: boolean, response: FetchResponse<V & X> | FetchError<X>

    this.setCallStatus(method, path, config, Status.PENDING)

    await Polyfill.blob()
    await Polyfill.fetch()
    await Polyfill.file()
    await Polyfill.formData()

    tbody = await this.transformBody(method, path, body, config)
    query = await this.transformQueryParameters(method, path, body, config)

    handled = await this.handlePending(method, path, tbody, config)
    if (!handled) return rc(() => this.setCallStatus(method, path, config, Status.ERROR), FetchError.from())

    response = await Fetch.handle(appendSearchParamsToURL(concatURL(this.baseURL, path), query), {
      body: tbody,
      method,
      ...mergeFetchRequestInits(this.config, config)
    })

    if (response instanceof Error) {
      handled = await this.handleError(method, path, tbody, config, response)
      if (!handled) return rc(() => this.setCallStatus(method, path, config, Status.ERROR), response)

      return rc(() => this.setCallStatus(method, path, config, Status.SUCCESS), response)
    }

    handled = await this.handleSuccess(method, path, tbody, config, response)
    if (!handled) return rc(() => this.setCallStatus(method, path, config, Status.ERROR), FetchError.from(response))

    return rc(() => this.setCallStatus(method, path, config, Status.SUCCESS), response)
  }

  /**
   * Performs a CONNECT request.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async connect<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>(RequestMethod.CONNECT, path, undefined, config)
  }

  /**
   * Performs a DELETE request.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async delete<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>(RequestMethod.DELETE, path, undefined, config)
  }

  /**
   * Performs a GET request.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async get<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>(RequestMethod.GET, path, undefined, config)
  }

  /**
   * Performs a HEAD request.
   */
  async head(path: string, config?: T): Promise<FetchResponse | FetchError> {
    return this.handle(RequestMethod.GET, path, undefined, config)
  }

  /**
   * Performs a OPTIONS request.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async options<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>(RequestMethod.OPTIONS, path, undefined, config)
  }

  /**
   * Performs a PATCH request.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async patch<V, W, X = U>(path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    return this.handle<V, W, X>(RequestMethod.PATCH, path, body, config)
  }

  /**
   * Performs a POST request.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async post<V, W, X = U>(path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    return this.handle<V, W, X>(RequestMethod.POST, path, body, config)
  }

  /**
   * Performs a PUT request.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async put<V, W, X = U>(path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    return this.handle<V, W, X>(RequestMethod.PUT, path, body, config)
  }

  /**
   * Performs a TRACE request.
   */
  async trace(path: string, config?: T): Promise<FetchResponse | FetchError> {
    return this.handle(RequestMethod.TRACE, path, undefined, config)
  }

  /**
   * Performs a POST request if mode is CREATE or a PUT request if mode is UPDATE.
   *
   * @template V The response data interface.
   * @template W The body interface.
   * @template X The error data interface, defaults to U.
   */
  async write<V, W, X = U>(mode: WriteMode, path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    switch (mode) {
      case WriteMode.CREATE:
        return this.post(path, body, config)
      case WriteMode.UPDATE:
        return this.put(path, body, config)
    }
  }

  /**
   * Transforms the body.
   *
   * @template V The body interface.
   */
  async transformBody<V>(method: RequestMethod, path: string, body: V | undefined, config: T): Promise<any> {
    return body
  }

  /**
   * Transforms the query parameters.
   *
   * @template V The body interface.
   */
  async transformQueryParameters<V>(method: RequestMethod, path: string, body: V | undefined, config: T): Promise<string> {
    if (typeof config.query === 'object') {
      return convertQueryParametersObjectToString(config.query)
    }

    return config.query || ''
  }

  /**
   * Called when any API call returns an Error.
   *
   * @template V The body interface.
   * @template W The error data interface, defaults to U.
   */
  async handleError<V, W = U>(method: RequestMethod, path: string, body: V | undefined, config: T, error: FetchError<W>): Promise<boolean> {
    return false
  }

  /**
   * Called when any API call has started.
   *
   * @template V The body interface.
   */
  async handlePending<V>(method: RequestMethod, path: string, body: V | undefined, config: T): Promise<boolean> {
    return true
  }

  /**
   * Called when any API call returns an Error.
   *
   * @template V The response data interface.
   * @template W The body interface.
   */
  async handleSuccess<V, W>(method: RequestMethod, path: string, body: W | undefined, config: T, response: FetchResponse<V>): Promise<boolean> {
    return true
  }

  /** @internal */
  private setCallStatus(method: RequestMethod, path: string, config: T, status: string): void {
    if (this.isConfigStatusSettable(config, status)) {
      this.status.set([method, path], status)
    }
  }

  /** @internal */
  private isConfigStatusSettable(config: APIConfig, status: string): boolean {
    return config.status?.blacklist ? !config.status.blacklist.includes(status) : config.status?.whitelist ? config.status.whitelist.includes(status) : true
  }
}
