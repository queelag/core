import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { GraphQLAPIResponseBody } from '../definitions/interfaces'
import { rc } from './rc'
import { Status } from './status'
import { tcp } from './tcp'

export class GraphQLAPI<T extends AxiosRequestConfig = AxiosRequestConfig, U = undefined> {
  readonly baseURL: string
  readonly config: T
  readonly instance: AxiosInstance
  readonly status: Status

  constructor(url: string = '', config: T = GraphQLAPI.dummyConfig) {
    this.baseURL = url
    this.config = config
    this.instance = Axios.create({ baseURL: url, ...config })
    this.status = new Status()
  }

  async handle<V extends GraphQLAPIResponseBody, W, X = U>(
    query: string,
    variables?: W,
    config: T = GraphQLAPI.dummyConfig
  ): Promise<AxiosResponse<V> | AxiosError<X>> {
    let handled: boolean, response: AxiosResponse<V> | AxiosError<X>

    this.status.pending(query)

    handled = await this.handlePending(query, variables, config)
    if (!handled) return rc(() => this.status.error(query), new Error() as AxiosError<X>)

    response = await tcp<AxiosResponse<V>, AxiosError<X>>(() => this.instance.post<V>('', { query, variables }, config))
    if (response instanceof Error) return response

    if (response instanceof Error || response.data.errors) {
      handled = await this.handleError(query, variables, config, response as any)
      if (!handled) return rc(() => this.status.error(query), response)

      return rc(() => this.status.success(query), response)
    }

    handled = await this.handleSuccess(query, variables, config, response)
    if (!handled) return rc(() => this.status.error(query), new Error() as AxiosError<X>)

    return rc(() => this.status.success(query), response)
  }

  async handleError<V, W = U>(query: string, variables: V | undefined, config: T, error: AxiosError<W>): Promise<boolean> {
    return false
  }

  async handlePending<V>(query: string, variables: V | undefined, config: T): Promise<boolean> {
    return true
  }

  async handleSuccess<V extends GraphQLAPIResponseBody, W>(query: string, variables: W | undefined, config: T, response: AxiosResponse<V>): Promise<boolean> {
    return true
  }

  /** @internal */
  static get dummyConfig(): any {
    return {}
  }
}
