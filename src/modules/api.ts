import { FetchError } from '../classes/fetch-error.js'
import { FetchResponse } from '../classes/fetch-response.js'
import { EMPTY_OBJECT } from '../definitions/constants.js'
import { APIConfig } from '../definitions/interfaces.js'
import { RequestMethod, WriteMode } from '../definitions/types.js'
import { rc } from '../functions/rc.js'
import { mergeFetchRequestInits } from '../utils/fetch-utils.js'
import { serializeQueryParameters } from '../utils/query-parameters-utils.js'
import { appendSearchParamsToURL, concatURL } from '../utils/url-utils.js'
import { Fetch } from './fetch.js'
import { importNodeFetch, useNodeFetch } from './polyfill.js'
import { Status } from './status.js'

/**
 * @category Module
 */
export class API<T extends APIConfig = APIConfig, U = undefined> {
  readonly baseURL: string
  readonly config: T
  readonly status: Status

  constructor(baseURL: string = '', config: T = EMPTY_OBJECT()) {
    this.baseURL = baseURL
    this.config = config
    this.status = new Status()
  }

  protected async onHandleStart(): Promise<void> {}

  async handle<V, W, X = U>(method: RequestMethod, path: string, body?: W, config: T = EMPTY_OBJECT()): Promise<FetchResponse<V> | FetchError<X>> {
    let tbody: W | undefined, query: string, handled: boolean, response: FetchResponse<V & X> | FetchError<X>

    this.setCallStatus(method, path, config, Status.PENDING)

    await useNodeFetch(await importNodeFetch())

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

  async connect<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>('CONNECT', path, undefined, config)
  }

  async delete<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>('DELETE', path, undefined, config)
  }

  async get<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>('GET', path, undefined, config)
  }

  async head(path: string, config?: T): Promise<FetchResponse | FetchError> {
    return this.handle('HEAD', path, undefined, config)
  }

  async options<V, W = U>(path: string, config?: T): Promise<FetchResponse<V> | FetchError<W>> {
    return this.handle<V, any, W>('OPTIONS', path, undefined, config)
  }

  async patch<V, W, X = U>(path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    return this.handle<V, W, X>('PATCH', path, body, config)
  }

  async post<V, W, X = U>(path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    return this.handle<V, W, X>('POST', path, body, config)
  }

  async put<V, W, X = U>(path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    return this.handle<V, W, X>('PUT', path, body, config)
  }

  async trace(path: string, config?: T): Promise<FetchResponse | FetchError> {
    return this.handle('TRACE', path, undefined, config)
  }

  async write<V, W, X = U>(mode: WriteMode, path: string, body?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    switch (mode) {
      case 'create':
        return this.post(path, body, config)
      case 'update':
        return this.put(path, body, config)
    }
  }

  async transformBody<V>(method: RequestMethod, path: string, body: V | undefined, config: T): Promise<any> {
    return body
  }

  async transformQueryParameters<V>(method: RequestMethod, path: string, body: V | undefined, config: T): Promise<string> {
    if (typeof config.query === 'object') {
      return serializeQueryParameters(config.query)
    }

    return config.query ?? ''
  }

  async handleError<V, W = U>(method: RequestMethod, path: string, body: V | undefined, config: T, error: FetchError<W>): Promise<boolean> {
    return false
  }

  async handlePending<V>(method: RequestMethod, path: string, body: V | undefined, config: T): Promise<boolean> {
    return true
  }

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
    if (config.status?.blacklist) {
      return !config.status.blacklist.includes(status)
    }

    if (config.status?.whitelist) {
      return config.status.whitelist.includes(status)
    }

    return true
  }
}
