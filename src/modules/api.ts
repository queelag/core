import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { APIMethod } from '../definitions/enums'
import { StatusTransformer } from '../definitions/types'
import { URLUtils } from '../utils/url.utils'
import { rc } from './rc'
import { Status } from './status'
import { tcp } from './tcp'

export class API {
  readonly baseURL: string
  readonly config: AxiosRequestConfig
  readonly instance: AxiosInstance
  readonly status: Status

  constructor(baseURL: string = '', config: AxiosRequestConfig = {}, statusTransformer: StatusTransformer = API.defaultStatusTransformer) {
    this.baseURL = baseURL
    this.config = config
    this.instance = Axios.create({ baseURL: baseURL, ...config })
    this.status = new Status(statusTransformer)
  }

  async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T> | AxiosError> {
    return this.handle<T>(APIMethod.DELETE, url, undefined, config)
  }

  async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T> | AxiosError> {
    return this.handle<T>(APIMethod.GET, url, undefined, config)
  }

  async post<T, U>(url: string, data?: U, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T> | AxiosError> {
    return this.handle<T, U>(APIMethod.POST, url, data, config)
  }

  async put<T, U>(url: string, data?: U, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T> | AxiosError> {
    return this.handle<T, U>(APIMethod.PUT, url, data, config)
  }

  private async handle<T, U = any>(method: APIMethod, url: string, data?: U, config: AxiosRequestConfig = {}): Promise<AxiosResponse<T> | AxiosError> {
    let handled: boolean, response: AxiosResponse<T> | AxiosError

    this.status.pending(method, url)

    handled = await this.handlePending(method, url, data, config)
    if (!handled) return new Error() as AxiosError

    switch (method) {
      case APIMethod.DELETE:
        response = await tcp<AxiosResponse<T>, AxiosError>(() => this.instance.delete<T>(url, config))
        break
      case APIMethod.GET:
        response = await tcp<AxiosResponse<T>, AxiosError>(() => this.instance.get<T>(url, config))
        break
      case APIMethod.POST:
        response = await tcp<AxiosResponse<T>, AxiosError>(() => this.instance.post<T>(url, data, config))
        break
      case APIMethod.PUT:
        response = await tcp<AxiosResponse<T>, AxiosError>(() => this.instance.put<T>(url, data, config))
        break
    }

    if (response instanceof Error) {
      handled = await this.handleError(method, url, data, config, response)
      if (!handled) return rc(() => this.status.error(method, url), response)

      return rc(() => this.status.success(method, url), response)
    }

    handled = await this.handleSuccess(method, url, data, config, response)
    if (!handled) return new Error() as AxiosError

    return rc(() => this.status.success(method, url), response)
  }

  async handleError<T, U>(method: APIMethod, url: string, data: U | undefined, config: AxiosRequestConfig, error: AxiosError<T>): Promise<boolean> {
    return false
  }

  async handlePending<T, U>(method: APIMethod, url: string, data: U | undefined, config: AxiosRequestConfig): Promise<boolean> {
    return true
  }

  async handleSuccess<T, U>(method: APIMethod, url: string, data: U | undefined, config: AxiosRequestConfig, response: AxiosResponse<T>): Promise<boolean> {
    return true
  }

  static get defaultStatusTransformer(): (keys: string[]) => string {
    return (keys: string[]) => keys[0] + '_' + URLUtils.removeSearchParams(keys[1])
  }
}
