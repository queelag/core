import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { APIMethod } from '../definitions/enums'
import { StatusTransformer } from '../definitions/types'
import { URLUtils } from '../utils/url.utils'
import { Status } from './status'
import { tcp } from './tcp'

export class API {
  readonly baseURL: string
  readonly config: AxiosRequestConfig
  private readonly instance: AxiosInstance
  readonly status: Status

  constructor(baseURL: string = '', config: AxiosRequestConfig = {}, statusTransformer: StatusTransformer = Status.defaultTransformer) {
    this.baseURL = baseURL
    this.config = config
    this.instance = Axios.create({ baseURL: baseURL, ...config })
    this.status = new Status(statusTransformer)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T> | AxiosError> {
    return this.handle<T>(APIMethod.DELETE, url, undefined, config)
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T> | AxiosError> {
    return this.handle<T>(APIMethod.GET, url, undefined, config)
  }

  async post<T, U>(url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T> | AxiosError> {
    return this.handle<T, U>(APIMethod.POST, url, data, config)
  }

  async put<T, U>(url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T> | AxiosError> {
    return this.handle<T, U>(APIMethod.PUT, url, data, config)
  }

  private async handle<T, U = any>(method: APIMethod, url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T> | AxiosError> {
    let response: AxiosResponse<T> | AxiosError

    this.status.pending(method, URLUtils.removeSearchParams(url))

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

    response instanceof Error ? this.status.error(method, URLUtils.removeSearchParams(url)) : this.status.success(method, URLUtils.removeSearchParams(url))

    return response
  }
}
