import { ObjectUtils } from '..'
import { FetchError } from '../classes/fetch.error'
import { FetchResponse } from '../classes/fetch.response'
import { FetchRequestInit, GraphQLAPIConfig, GraphQLAPIResponseBody } from '../definitions/interfaces'
import { Fetch } from './fetch'
import { rc } from './rc'
import { Status } from './status'

/**
 * A module to smartly handle GraphQL API calls and observe their status through the {@link Status} module.
 *
 * @category Module
 * @template T The configuration interface which extends the {@link GraphQLAPIConfig} one
 * @template U The default Error interface
 */
export class GraphQLAPI<T extends FetchRequestInit = GraphQLAPIConfig, U = undefined> {
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
   * @template T The configuration interface which extends the {@link GraphlQLAPIConfig} one.
   * @template U The default Error interface.
   */
  constructor(baseURL: string = '', config: T = GraphQLAPI.dummyConfig) {
    this.baseURL = baseURL
    this.config = config
    this.status = new Status()
  }

  /**
   * Performs a request.
   *
   * @template V The response data interface which extends {@link GraphQLAPIResponseBody}.
   * @template W The variables.
   * @template X The error data interface, defaults to U.
   */
  async handle<V extends GraphQLAPIResponseBody, W, X = U>(
    query: string,
    variables?: W,
    config: T = GraphQLAPI.dummyConfig
  ): Promise<FetchResponse<V> | FetchError<X>> {
    let handled: boolean, response: FetchResponse<V & X> | FetchError<X>

    this.setCallStatus(query, config, Status.PENDING)

    handled = await this.handlePending(query, variables, config)
    if (!handled) return rc(() => this.setCallStatus(query, config, Status.ERROR), FetchError.from())

    response = await Fetch.post(this.baseURL, { query, variables }, ObjectUtils.merge(this.config, config))
    if (response instanceof Error) {
      handled = await this.handleError(query, variables, config, response)
      if (!handled) return rc(() => this.setCallStatus(query, config, Status.ERROR), response)

      return rc(() => this.setCallStatus(query, config, Status.SUCCESS), response.response as any)
    }

    if (response.data.errors) {
      handled = await this.handleError(query, variables, config, FetchError.from(response))
      if (!handled) return rc(() => this.setCallStatus(query, config, Status.ERROR), FetchError.from(response))

      return rc(() => this.setCallStatus(query, config, Status.SUCCESS), response)
    }

    handled = await this.handleSuccess(query, variables, config, response)
    if (!handled) return rc(() => this.setCallStatus(query, config, Status.ERROR), FetchError.from(response))

    return rc(() => this.setCallStatus(query, config, Status.SUCCESS), response)
  }

  /**
   * Called when any API call returns an Error.
   *
   * @template V The body interface.
   * @template W The error data interface, defaults to U.
   */
  async handleError<V, W = U>(query: string, variables: V | undefined, config: T, error: FetchError<W>): Promise<boolean> {
    return false
  }

  /**
   * Called when any API call has started.
   *
   * @template V The body interface.
   */
  async handlePending<V>(query: string, variables: V | undefined, config: T): Promise<boolean> {
    return true
  }

  /**
   * Called when any API call returns an Error.
   *
   * @template V The response data interface.
   * @template W The body interface.
   */
  async handleSuccess<V extends GraphQLAPIResponseBody, W>(query: string, variables: W | undefined, config: T, response: FetchResponse<V>): Promise<boolean> {
    return true
  }

  /** @internal */
  private setCallStatus(path: string, config: T, status: string): void {
    if (this.isConfigStatusSettable(config, status)) {
      this.status.set([path], status)
    }
  }

  /** @internal */
  private isConfigStatusSettable(config: GraphQLAPIConfig, status: string): boolean {
    return config.status?.blacklist ? !config.status.blacklist.includes(status) : config.status?.whitelist ? config.status.whitelist.includes(status) : true
  }

  /** @internal */
  static get dummyConfig(): any {
    return {}
  }
}
