import { EMPTY_OBJECT } from '../definitions/constants.js'
import type { RestApiConfig } from '../definitions/interfaces.js'
import type { RequestMethod, WriteMode } from '../definitions/types.js'
import { rc } from '../functions/rc.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { mergeFetchRequestInits } from '../utils/fetch-utils.js'
import { concatURL, serializeURLSearchParams } from '../utils/url-utils.js'
import { FetchError } from './fetch-error.js'
import type { FetchResponse } from './fetch-response.js'
import { Fetch } from './fetch.js'
import { Status } from './status.js'

/**
 * The RestAPI class manages the requests to a REST API.
 *
 * - The base URL of the API is automatically concatenated to the path of the requests.
 * - The config of the API is automatically merged with the config of the requests.
 * - The status of the requests is automatically tracked and can be accessed through the status property.
 * - The requests are sent with the Fetch class, so all features of the Fetch class are available.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/rest-api)
 */
export class RestAPI<T extends RestApiConfig = RestApiConfig, U = undefined> {
  /**
   * The base URL of the REST API.
   */
  protected baseURL: string
  /**
   * The default config of the REST API.
   */
  protected config: T
  /**
   * The status of the requests.
   */
  readonly status: Status

  constructor(baseURL: string = '', config: T = EMPTY_OBJECT()) {
    this.baseURL = baseURL
    this.config = config
    this.status = new Status()
  }

  /**
   * Sends a request to the REST API.
   */
  protected async send<V, W, X = U>(method: RequestMethod, path: string, body?: W, config: T = EMPTY_OBJECT()): Promise<FetchResponse<V> | FetchError<X>> {
    let tbody: W | undefined, query: string, url: URL, handled: boolean, response: FetchResponse<V & X> | FetchError<X>

    this.setCallStatus(method, path, config, Status.PENDING)

    tbody = await this.transformBody(method, path, body, config)
    query = await this.transformQueryParameters(method, path, body, config)

    handled = await this.handlePending(method, path, tbody, config)
    if (!handled) return rc(() => this.setCallStatus(method, path, config, Status.ERROR), FetchError.from())

    url = new URL(concatURL(this.baseURL, path))
    url.search = query

    response = await Fetch.send(url.toString(), {
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
   * Sends a CONNECT request to the REST API.
   */
  async connect<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.send<V, any, W>('CONNECT', path, undefined, config)
  }

  /**
   * Sends a DELETE request to the REST API.
   */
  async delete<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.send<V, any, W>('DELETE', path, undefined, config)
  }

  /**
   * Sends a GET request to the REST API.
   */
  async get<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.send<V, any, W>('GET', path, undefined, config)
  }

  /**
   * Sends a HEAD request to the REST API.
   */
  async head(path: string, config?: T): Promise<FetchResponse | FetchError> {
    return this.send('HEAD', path, undefined, config)
  }

  /**
   * Sends an OPTIONS request to the REST API.
   */
  async options<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.send<V, any, W>('OPTIONS', path, undefined, config)
  }

  /**
   * Sends a PATCH request to the REST API.
   */
  async patch<V, W, X = U>(path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    return this.send<V, W, X>('PATCH', path, body, config)
  }

  /**
   * Sends a POST request to the REST API.
   */
  async post<V, W, X = U>(path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    return this.send<V, W, X>('POST', path, body, config)
  }

  /**
   * Sends a PUT request to the REST API.
   */
  async put<V, W, X = U>(path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    return this.send<V, W, X>('PUT', path, body, config)
  }

  /**
   * Sends a TRACE request to the REST API.
   */
  async trace(path: string, config?: T): Promise<FetchResponse | FetchError> {
    return this.send('TRACE', path, undefined, config)
  }

  /**
   * Sends a POST request if the mode is 'create' or a PUT request if the mode is 'update' to the REST API.
   */
  async write<V, W, X = U>(mode: WriteMode, path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    switch (mode) {
      case 'create':
        return this.post(path, body, config)
      case 'update':
        return this.put(path, body, config)
    }
  }

  /**
   * Transforms the body of the request.
   */
  async transformBody<V>(method: RequestMethod, path: string, body: V | undefined, config: T): Promise<any> {
    return body
  }

  /**
   * Transforms the query parameters of the request.
   */
  async transformQueryParameters<V>(method: RequestMethod, path: string, body: V | undefined, config: T): Promise<string> {
    if (typeof config.query === 'object') {
      return serializeURLSearchParams(config.query).toString()
    }

    return config.query ?? ''
  }

  /**
   * Handles the error of the request.
   */
  async handleError<V, W = U>(method: RequestMethod, path: string, body: V | undefined, config: T, error: FetchError<W>): Promise<boolean> {
    return false
  }

  /**
   * Handles the pending state of the request.
   */
  async handlePending<V>(method: RequestMethod, path: string, body: V | undefined, config: T): Promise<boolean> {
    return true
  }

  /**
   * Handles the success of the request.
   */
  async handleSuccess<V, W>(method: RequestMethod, path: string, body: W | undefined, config: T, response: FetchResponse<V>): Promise<boolean> {
    return true
  }

  /**
   * Sets the status of the request.
   */
  protected setCallStatus(method: RequestMethod, path: string, config: T, status: string): void {
    if (this.isConfigStatusSettable(config, status)) {
      this.status.set([method, path], status)
    }
  }

  getBaseURL(): string {
    return this.baseURL
  }

  getConfig(): T {
    return this.config
  }

  setBaseURL(baseURL: string): this {
    this.baseURL = baseURL
    ClassLogger.verbose('RestAPI', 'setBaseURL', `The base URL has been set.`, [this.baseURL])

    return this
  }

  setConfig(config: T): this {
    this.config = config
    ClassLogger.verbose('RestAPI', 'setConfig', `The config has been set.`, this.config)

    return this
  }

  /**
   * Checks if the config status is settable.
   */
  protected isConfigStatusSettable(config: RestApiConfig, status: string): boolean {
    if (config.status?.blacklist) {
      return !config.status.blacklist.includes(status)
    }

    if (config.status?.whitelist) {
      return config.status.whitelist.includes(status)
    }

    return true
  }
}
