import type { DeserializeFormDataOptions, SerializeFormDataOptions } from '../definitions/interfaces.js'
import { isBlobDefined, isFileDefined } from './environment-utils.js'
import { decodeJSON, encodeJSON } from './json-utils.js'
import { isStringJSON } from './string-utils.js'

/**
 * Deserializes a `FormData` object into a plain object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/form-data)
 */
export function deserializeFormData<T extends object>(data: FormData, options?: DeserializeFormDataOptions): T {
  let object: T = {} as T

  for (let [k, v] of data.entries()) {
    if (typeof v === 'string' && isStringJSON(v)) {
      let decoded: any | Error

      decoded = decodeJSON(v, options?.json)
      if (decoded instanceof Error) continue

      object[k as keyof T] = decoded

      continue
    }

    object[k as keyof T] = v as any
  }

  return object
}

/**
 * Serializes an object into a `FormData` object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/form-data)
 */
export function serializeFormData<T extends object>(object: T, options?: SerializeFormDataOptions): FormData {
  let data: FormData

  data = new FormData()

  for (let [k, v] of Object.entries(object)) {
    switch (typeof v) {
      case 'bigint':
      case 'boolean':
      case 'number':
        data.append(k, v.toString())
        continue
      case 'function':
      case 'symbol':
      case 'undefined':
        continue
      case 'object': {
        let string: string | Error

        if (v === null) {
          continue
        }

        switch (true) {
          case isBlobDefined() && v instanceof Blob:
          case isFileDefined() && v instanceof File:
            data.append(k, v)
            continue
        }

        string = encodeJSON(v, options?.json)
        if (string instanceof Error) continue

        data.append(k, string)

        continue
      }
      case 'string':
        data.append(k, v)
        continue
    }
  }

  return data
}
