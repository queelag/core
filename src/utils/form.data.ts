import { isStringJSON } from './string'

export function convertFormDataToObject<T extends object>(data: FormData): T {
  let object: T

  object = {} as T

  for (let [k, v] of data.entries()) {
    if (typeof v === 'string' && isStringJSON(v)) {
      Reflect.set(object, k, JSON.parse(v))
      continue
    }

    Reflect.set(object, k, v)
  }

  return object
}
