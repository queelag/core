import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { APIMethod, WriteMode } from '../definitions/enums'
import { StatusTransformer } from '../definitions/types'
import { URLUtils } from '../utils/url.utils'
import { rc } from './rc'
import { Status } from './status'
import { tcp } from './tcp'

export class API<T extends AxiosRequestConfig = AxiosRequestConfig, U = undefined> {
  readonly baseURL: string
  readonly config: AxiosRequestConfig
  readonly instance: AxiosInstance
  readonly status: Status

  constructor(baseURL: string = '', config: T = API.dummyConfig, statusTransformer: StatusTransformer = API.defaultStatusTransformer) {
    this.baseURL = baseURL
    this.config = config
    this.instance = Axios.create({ baseURL: baseURL, ...config })
    this.status = new Status(statusTransformer)
  }

  async delete<V, W = U>(url: string, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<W>> {
    return this.handle<V, any, W>(APIMethod.DELETE, url, undefined, config)
  }

  async get<V, W = U>(url: string, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<W>> {
    return this.handle<V, any, W>(APIMethod.GET, url, undefined, config)
  }

  async post<V, W, X = U>(url: string, data?: W, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<X>> {
    return this.handle<V, W, X>(APIMethod.POST, url, data, config)
  }

  async put<V, W, X = U>(url: string, data?: W, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<X>> {
    return this.handle<V, W, X>(APIMethod.PUT, url, data, config)
  }

  async write<V, W, X = U>(mode: WriteMode, url: string, data?: W, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<X>> {
    switch (mode) {
      case WriteMode.CREATE:
        return this.post(url, data, config)
      case WriteMode.UPDATE:
        return this.put(url, data, config)
    }
  }

  private async handle<V, W, X = U>(method: APIMethod, url: string, data?: W, config: T = API.dummyConfig): Promise<AxiosResponse<V> | AxiosError<X>> {
    let handled: boolean, response: AxiosResponse<V> | AxiosError<X>

    this.status.pending(method, url)

    handled = await this.handlePending(method, url, data, config)
    if (!handled) return new Error() as AxiosError<X>

    switch (method) {
      case APIMethod.DELETE:
        response = await tcp<AxiosResponse<V>, AxiosError<X>>(() => this.instance.delete<V>(url, config))
        break
      case APIMethod.GET:
        response = await tcp<AxiosResponse<V>, AxiosError<X>>(() => this.instance.get<V>(url, config))
        break
      case APIMethod.POST:
        response = await tcp<AxiosResponse<V>, AxiosError<X>>(() => this.instance.post<V>(url, data, config))
        break
      case APIMethod.PUT:
        response = await tcp<AxiosResponse<V>, AxiosError<X>>(() => this.instance.put<V>(url, data, config))
        break
    }

    if (response instanceof Error) {
      handled = await this.handleError(method, url, data, config, response)
      if (!handled) return rc(() => this.status.error(method, url), response)

      return rc(() => this.status.success(method, url), response)
    }

    handled = await this.handleSuccess(method, url, data, config, response)
    if (!handled) return new Error() as AxiosError<X>

    return rc(() => this.status.success(method, url), response)
  }

  async handleError<V, W, X = U>(method: APIMethod, url: string, data: W | undefined, config: T, error: AxiosError<X>): Promise<boolean> {
    return false
  }

  async handlePending<V>(method: APIMethod, url: string, data: V | undefined, config: T): Promise<boolean> {
    return true
  }

  async handleSuccess<V, W>(method: APIMethod, url: string, data: W | undefined, config: T, response: AxiosResponse<V>): Promise<boolean> {
    return true
  }

  static get defaultStatusTransformer(): (keys: string[]) => string {
    return (keys: string[]) => keys[0] + '_' + URLUtils.removeSearchParams(keys[1])
  }

  static get dummyConfig(): any {
    return {}
  }
}
