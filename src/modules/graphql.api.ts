import { FetchError } from '../classes/fetch.error'
import { FetchResponse } from '../classes/fetch.response'
import { APIConfig, FetchRequestInit, GraphQLAPIResponseBody } from '../definitions/interfaces'
import { Fetch } from './fetch'
import { rc } from './rc'
import { Status } from './status'

export class GraphQLAPI<T extends FetchRequestInit = APIConfig, U = undefined> {
  readonly baseURL: string
  readonly config: T
  readonly status: Status

  constructor(url: string = '', config: T = GraphQLAPI.dummyConfig) {
    this.baseURL = url
    this.config = config
    this.status = new Status()
  }

  async handle<V extends GraphQLAPIResponseBody, W, X = U>(
    query: string,
    variables?: W,
    config: T = GraphQLAPI.dummyConfig
  ): Promise<FetchResponse<V> | FetchError<X>> {
    let handled: boolean, response: FetchResponse<V> | FetchError<X>

    this.status.pending(query)

    handled = await this.handlePending(query, variables, config)
    if (!handled) return rc(() => this.status.error(query), new Error() as FetchError<X>)

    response = await Fetch.post(this.baseURL, { query, variables }, config)
    if (response instanceof Error) return response

    if (response instanceof Error || response.data.errors) {
      handled = await this.handleError(query, variables, config, response as any)
      if (!handled) return rc(() => this.status.error(query), response)

      return rc(() => this.status.success(query), response)
    }

    handled = await this.handleSuccess(query, variables, config, response)
    if (!handled) return rc(() => this.status.error(query), new Error() as FetchError<X>)

    return rc(() => this.status.success(query), response)
  }

  async handleError<V, W = U>(query: string, variables: V | undefined, config: T, error: FetchError<W>): Promise<boolean> {
    return false
  }

  async handlePending<V>(query: string, variables: V | undefined, config: T): Promise<boolean> {
    return true
  }

  async handleSuccess<V extends GraphQLAPIResponseBody, W>(query: string, variables: W | undefined, config: T, response: FetchResponse<V>): Promise<boolean> {
    return true
  }

  /** @internal */
  static get dummyConfig(): any {
    return {}
  }
}
