import { tc } from '../functions/tc.js'
import { Environment } from '../modules/environment.js'
import { isStringJSON } from './string-utils.js'

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

export function serializeFormData<T extends object>(object: T): FormData {
  let data: FormData = new FormData()

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
        let stringified: string | Error

        if (v === null) {
          continue
        }

        switch (true) {
          case Environment.isBlobDefined && v instanceof Blob:
          case Environment.isFileDefined && v instanceof File:
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
