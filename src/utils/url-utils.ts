import {
  REGEXP_URL_AMPERSANDS_AFTER_QUESTION_MARKS,
  REGEXP_URL_ENDING_WITH_QUESTION_MARK,
  REGEXP_URL_MULTIPLE_AMPERSANDS,
  REGEXP_URL_MULTIPLE_QUESTION_MARKS,
  REGEXP_URL_MULTIPLE_SLASHES,
  REGEXP_URL_QUESTION_MARKS_AFTER_AMPERSANDS
} from '../definitions/constants.js'
import { DeserializeURLSearchParamsType } from '../definitions/types.js'
import { isArray } from './array-utils.js'

export function concatURL(...chunks: Partial<string>[]): string {
  return chunks
    .filter(Boolean)
    .map((v: string) => v.trim())
    .join('/')
    .replace(REGEXP_URL_MULTIPLE_SLASHES, (substring: string) => (substring.includes(':') ? substring : '/'))
    .trim()
}

export function appendSearchParamsToURL(url: string, parameters: string): string {
  return [url.trim(), parameters.trim()]
    .join(url.includes('=') ? '&' : '?')
    .replace(REGEXP_URL_ENDING_WITH_QUESTION_MARK, '')
    .replace(REGEXP_URL_MULTIPLE_AMPERSANDS, '&')
    .replace(REGEXP_URL_MULTIPLE_QUESTION_MARKS, '?')
    .replace(REGEXP_URL_AMPERSANDS_AFTER_QUESTION_MARKS, '?')
    .replace(REGEXP_URL_QUESTION_MARKS_AFTER_AMPERSANDS, '&')
}

export function removeSearchParamsFromURL(url: string): string {
  return url.slice(0, url.includes('?') ? url.indexOf('?') : undefined)
}

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
          case 'symbol':
          case 'undefined':
            continue
          case 'object':
            if (isArray(v)) {
              record[k] = v.join(',')
            }

            continue
          case 'string':
            record[k] = v
            continue
        }
      }

      return new URLSearchParams(record)
    default:
      return new URLSearchParams()
  }
}
