import type { GraphQlApiConfig, GraphQlApiRequestBody, GraphQlApiResponse } from '../definitions/interfaces.js'
import type { FetchError } from './fetch-error.js'
import type { FetchResponse } from './fetch-response.js'
import { RestAPI } from './rest-api.js'

/**
 * The GraphQlAPI class extends the RestAPI class and manages the requests to a GraphQL API.
 *
 * - The base URL of the API is automatically concatenated to the path of the requests.
 * - The config of the API is automatically merged with the config of the requests.
 * - The status of the requests is automatically tracked and can be accessed through the status property.
 * - The requests are sent with the Fetch class, so all features of the Fetch class are available.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/graphql-api)
 */
export class GraphQlAPI<T extends GraphQlApiConfig = GraphQlApiConfig, U = undefined> extends RestAPI<T, U> {
  /**
   * Sends a POST request to the GraphQL API.
   */
  async post<V, W, X = U>(query: string, variables?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    let body: GraphQlApiRequestBody<W>

    body = {
      query,
      variables
    }

    return this.send('POST', '', body, config)
  }

  /**
   * Sends a mutation to the GraphQL API.
   */
  async mutation<V, W extends object, X = U>(mutation: string, variables?: W, config?: T): Promise<GraphQlApiResponse<V> | FetchError<X>> {
    return this.post(mutation, variables, config)
  }

  /**
   * Sends a query to the GraphQL API.
   */
  async query<V, W extends object, X = U>(query: string, variables?: W, config?: T): Promise<GraphQlApiResponse<V> | FetchError<X>> {
    return this.post(query, variables, config)
  }
}
