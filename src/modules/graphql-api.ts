import { FetchError } from '../classes/fetch-error.js'
import { FetchResponse } from '../classes/fetch-response.js'
import { RequestMethod } from '../definitions/enums.js'
import { GraphQLAPIConfig, GraphQLAPIRequestBody, GraphQLAPIResponse } from '../definitions/interfaces.js'
import { API } from './api.js'

/**
 * A module to smartly handle GraphQL API calls and observe their status through the {@link Status} module.
 *
 * @category Module
 * @template T The configuration interface which extends the {@link GraphQLAPIConfig} one
 * @template U The default Error interface
 */
export class GraphQLAPI<T extends GraphQLAPIConfig = GraphQLAPIConfig, U = undefined> extends API<T, U> {
  /**
   * @template T The configuration interface which extends the {@link GraphlQLAPIConfig} one.
   * @template U The default Error interface.
   */
  constructor(baseURL?: string, config?: T) {
    super(baseURL, config)
  }

  async post<V, W, X = U>(query: string, variables?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    let body: GraphQLAPIRequestBody<W>

    body = {
      query,
      variables
    }

    return this.handle(RequestMethod.POST, '', body, config)
  }

  /**
   * Performs a MUTATION.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async mutation<V, W extends object, X = U>(mutation: string, variables?: W, config?: T): Promise<GraphQLAPIResponse<V> | FetchError<X>> {
    return this.post(mutation, variables, config)
  }

  /**
   * Performs a QUERY.
   *
   * @template V The response data interface.
   * @template W The error data interface, defaults to U.
   */
  async query<V, W extends object, X = U>(query: string, variables?: W, config?: T): Promise<GraphQLAPIResponse<V> | FetchError<X>> {
    return this.post(query, variables, config)
  }
}
