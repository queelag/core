import { DeserializeURLSearchParamsType } from '../definitions/types.js'
import { isArray } from './array-utils.js'

export function deserializeURLSearchParams<T extends Record<string, string>>(params: URLSearchParams): T
export function deserializeURLSearchParams(params: URLSearchParams, type: 'string'): string
export function deserializeURLSearchParams(params: URLSearchParams, type: 'array'): string[][]
export function deserializeURLSearchParams<T extends Record<string, string>>(params: URLSearchParams, type: 'object'): T
export function deserializeURLSearchParams<T extends Record<string, string>>(
  params: URLSearchParams,
  type: DeserializeURLSearchParamsType = 'object'
): string | string[][] | T {
  switch (type) {
    case 'array':
      return [...params.entries()]
    case 'object':
      let record: T = {} as T

      for (let [k, v] of params.entries()) {
        record[k as keyof T] = v as T[keyof T]
      }

      return record
    case 'string':
      return params.toString()
  }
}

export function serializeURLSearchParams<T extends object>(params: string | string[][] | T): URLSearchParams {
  switch (typeof params) {
    case 'string':
      return new URLSearchParams(params)
    case 'object':
      let record: Record<string, string> = {}

      if (isArray(params)) {
        return new URLSearchParams(params)
      }

      for (let [k, v] of Object.entries(params)) {
        switch (typeof v) {
          case 'bigint':
          case 'boolean':
          case 'number':
            record[k] = v.toString()
            continue
          case 'function':
          case 'object':
          case 'symbol':
          case 'undefined':
            continue
          case 'string':
            continue
        }
      }

      return new URLSearchParams(record)
    default:
      return new URLSearchParams()
  }
}
