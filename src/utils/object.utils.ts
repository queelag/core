import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import { tc } from '../functions/tc'
import { Environment } from '../modules/environment'

/**
 * Clones an object.
 *
 * @template T The object interface.
 */
export function cloneObject<T extends object>(object: T): T {
  return { ...object }
}

/**
 * Clones an object deeply.
 *
 * @template T The object interface.
 */
export function cloneDeepObject<T extends object>(object: T, native: boolean = true): T {
  if (native) {
    return JSON.parse(JSON.stringify(object))
  }

  return cloneDeep(object)
}

/**
 * Deletes a property from an object, supports dot notation.
 *
 * @template T The object interface.
 * @template U The value interface or type.
 */
export function deleteObjectProperty<T extends object>(object: T, key: string | keyof T): void {
  switch (typeof key) {
    case 'number':
    case 'symbol':
      delete object[key]
      break
    case 'string':
      if (key.includes('.')) {
        let keys: string[], parent: any | Error

        keys = key.split('.')

        parent = tc(() => keys.reduce((r: any, k: string, i: number) => (i < keys.length - 1 ? r[k] : r), object))
        if (parent instanceof Error) return

        delete parent[keys[keys.length - 1]]

        return
      }

      delete object[key as keyof T]

      break
  }
}

/**
 * Gets a key from an object, supports dot notation.
 *
 * @template T The object interface.
 * @template U The value interface or type.
 */
export function getObjectProperty<T extends object, U extends any>(object: T, key: string | keyof T, fallback: U, verbose: boolean = false): U {
  switch (typeof key) {
    case 'number':
    case 'symbol':
      return object[key] as U
    case 'string':
      if (key.includes('.')) {
        let value: U | Error

        value = tc(
          () =>
            key.split('.').reduce((r: any, k: string) => {
              let key: string

              key = k.replace(/[\[\]]/g, '')
              if (Object.keys(r).includes(key)) return r[key]

              throw new Error(`The object does not include the key ${key}.`)
            }, object),
          verbose
        )
        if (value instanceof Error) return fallback

        return value
      }

      return Object.keys(object).includes(key) ? (object[key as keyof T] as U) : fallback
  }
}

/**
 * Merges multiple objects without touching the target.
 *
 * @template T the object interface.
 */
export function mergeObjects<T extends object>(target: T, ...sources: object[]): T {
  return merge(cloneObject(target), ...sources.map((v: object) => cloneObject(v)))
}

/**
 * Creates a new object without the omitted properties of T.
 *
 * @template T The object interface.
 */
export function omitObjectProperties<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
  let clone: T

  clone = { ...object }

  for (let key of keys) {
    delete clone[key]
  }

  return clone
}

/**
 * Creates a new object with only the picked keys of T.
 *
 * @template T The object interface.
 */
export function pickObjectProperties<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  let pick: Pick<T, K>

  // @ts-ignore
  pick = {}

  for (let key of keys) {
    if (hasObjectProperty(object, key)) {
      // @ts-ignore
      pick[key] = object[key]
    }
  }

  return pick
}

/**
 * Creates an array of values of picked properties of T.
 *
 * @template T The object interface.
 */
export function pickObjectPropertiesToArray<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K>[] {
  let pick: Pick<T, keyof T>[]

  pick = []

  for (let [k, v] of Object.entries(object)) {
    if (keys.includes(k as K)) {
      pick.push(v)
    }
  }

  return pick
}

/**
 * Sets a value to a key in an object, supports dot notation.
 *
 * @template T The object interface.
 * @template U The value interface or type.
 */
export function setObjectProperty<T extends object, U extends any>(object: T, key: string | keyof T, value: U): void {
  switch (typeof key) {
    case 'number':
    case 'symbol':
      object[key] = value as any
      break
    case 'string':
      if (key.includes('.')) {
        let keys: string[], parent: any | Error

        keys = key.split('.')

        parent = tc(() =>
          keys.reduce((r: any, k: string, i: number) => {
            if (i >= keys.length - 1) return r

            switch (typeof r[k]) {
              case 'object':
                return r[k]
              case 'undefined':
                r[k] = {}
                return r[k]
              default:
                throw new Error(`The value type is nor undefined nor object.`)
            }
          }, object)
        )
        if (parent instanceof Error) return

        parent[keys[keys.length - 1]] = value

        return
      }

      object[key as keyof T] = value as any

      break
  }
}

export function convertObjectToFormData<T extends object>(object: T): FormData {
  let data: FormData

  data = new FormData()

  for (let [k, v] of Object.entries(object)) {
    switch (true) {
      case Environment.isFileDefined && v instanceof File:
        data.append(k, v)
        continue
      default:
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

            stringified = tc(() => JSON.stringify(v))
            if (stringified instanceof Error) continue

            data.append(k, stringified)

            continue
          case 'string':
            data.append(k, v)
            continue
        }
    }
  }

  return data
}

/**
 * Checks whether the object has the property or not.
 *
 * @template T The object interface.
 */
export function hasObjectProperty<T extends object>(object: T, key: string | keyof T): boolean {
  let symbol: symbol

  // symbols are always unique
  symbol = Symbol()

  return getObjectProperty(object, key, symbol) !== symbol
}

/**
 * Checks if the object has keys.
 *
 * @template T The object interface.
 */
export function isObjectKeysPopulated<T extends object>(object: T): boolean {
  return Object.keys(object).length > 0
}

/**
 * Checks if the object has values.
 *
 * @template T The object interface.
 */
export function isObjectValuesPopulated<T extends object>(object: T): boolean {
  return Object.values(object).length > 0
}

/**
 * Checks whether the object is really an object or not.
 */
export function isObject(value: any): value is object {
  return typeof value === 'object' && !Array.isArray(value)
}
