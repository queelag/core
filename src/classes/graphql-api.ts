import { GraphQlApiConfig, GraphQlApiRequestBody, GraphQlApiResponse } from '../definitions/interfaces.js'
import { FetchError } from './fetch-error.js'
import { FetchResponse } from './fetch-response.js'
import { RestAPI } from './rest-api.js'

export class GraphQlAPI<T extends GraphQlApiConfig = GraphQlApiConfig, U = undefined> extends RestAPI<T, U> {
  constructor(baseURL?: string, config?: T) {
    super(baseURL, config)
  }

  async post<V, W, X = U>(query: string, variables?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    let body: GraphQlApiRequestBody<W>

    body = {
      query,
      variables
    }

    return this.send('POST', '', body, config)
  }

  async mutation<V, W extends object, X = U>(mutation: string, variables?: W, config?: T): Promise<GraphQlApiResponse<V> | FetchError<X>> {
    return this.post(mutation, variables, config)
  }

  async query<V, W extends object, X = U>(query: string, variables?: W, config?: T): Promise<GraphQlApiResponse<V> | FetchError<X>> {
    return this.post(query, variables, config)
  }
}
