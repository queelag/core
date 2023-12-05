import { GraphQLAPIConfig, GraphQLAPIRequestBody, GraphQLAPIResponse } from '../definitions/interfaces.js'
import { API } from './api.js'
import { FetchError } from './fetch-error.js'
import { FetchResponse } from './fetch-response.js'

export class GraphQLAPI<T extends GraphQLAPIConfig = GraphQLAPIConfig, U = undefined> extends API<T, U> {
  constructor(baseURL?: string, config?: T) {
    super(baseURL, config)
  }

  async post<V, W, X = U>(query: string, variables?: W, config?: T): Promise<FetchResponse<V> | FetchError<X>> {
    let body: GraphQLAPIRequestBody<W>

    body = {
      query,
      variables
    }

    return this.handle('POST', '', body, config)
  }

  async mutation<V, W extends object, X = U>(mutation: string, variables?: W, config?: T): Promise<GraphQLAPIResponse<V> | FetchError<X>> {
    return this.post(mutation, variables, config)
  }

  async query<V, W extends object, X = U>(query: string, variables?: W, config?: T): Promise<GraphQLAPIResponse<V> | FetchError<X>> {
    return this.post(query, variables, config)
  }
}
