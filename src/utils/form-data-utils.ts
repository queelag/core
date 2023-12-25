import { tc } from '../functions/tc.js'
import { isBlobDefined, isFileDefined } from './environment-utils.js'
import { isStringJSON } from './string-utils.js'

/**
 * Deserializes a `FormData` object into a plain object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/form-data)
 */
export function deserializeFormData<T extends object>(data: FormData): T {
  let object: T = {} as T

  for (let [k, v] of data.entries()) {
    if (typeof v === 'string' && isStringJSON(v)) {
      object[k as keyof T] = JSON.parse(v)
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
export function serializeFormData<T extends object>(object: T): FormData {
  let data: FormData, stringified: string | Error

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
      case 'object':
        if (v === null) {
          continue
        }

        switch (true) {
          case isBlobDefined() && v instanceof Blob:
          case isFileDefined() && v instanceof File:
            data.append(k, v)
            continue
        }

        stringified = tc(() => JSON.stringify(v))
        if (stringified instanceof Error) continue

        data.append(k, stringified)

        continue
      case 'string':
        data.append(k, v)
        continue
    }
  }

  return data
}
