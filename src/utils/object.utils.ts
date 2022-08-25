import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import { REGEXP_SQUARE_BRACKETS } from '../definitions/constants'
import { KeyOf } from '../definitions/types'
import { tc } from '../functions/tc'
import { Environment } from '../modules/environment'

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
 * Clones an object shallowly.
 *
 * @template T The object interface.
 */
export function cloneShallowObject<T extends object>(object: T): T {
  return { ...object }
}

/**
 * Copies a property from an object to another, supports dot notation.
 *
 * @template T1 The source object interface.
 * @template T2 The target object interface.
 * @template T The source and target object shared interface.
 */
export function copyObjectProperty<T1 extends object, T2 extends object, T extends T1 & T2>(source: T, key: KeyOf.Deep<T>, target: T): void | Error
export function copyObjectProperty<T1 extends object, T2 extends object, T extends T1 & T2>(source: T, key: string, target: T): void | Error
export function copyObjectProperty<T1 extends object, T2 extends object, T extends T1 & T2>(source: T, key: KeyOf.Deep<T>, target: T): void | Error {
  return setObjectProperty(target, key, getObjectProperty(source, key))
}

/**
 * Deletes a property from an object, supports dot notation.
 *
 * @template T The object interface.
 * @template U The value interface or type.
 */
export function deleteObjectProperty<T extends object>(object: T, key: KeyOf.Deep<T>): void {
  switch (typeof key) {
    case 'number':
    case 'symbol':
      delete object[key]
      break
    case 'string':
      if (key.includes('.')) {
        let target: any | undefined, keys: string[], lkey: string

        target = getObjectPropertyDotKeyTarget(object, key)
        if (!target) return

        keys = key.split('.')
        lkey = keys[keys.length - 1].replace(REGEXP_SQUARE_BRACKETS, '')

        delete target[lkey]

        return
      }

      // @ts-ignore
      delete object[key]

      break
  }
}

/**
 * Gets a property from an object, supports dot notation.
 *
 * @template T The object interface.
 * @template U The value interface or type.
 */
export function getObjectProperty<T extends object, U extends any>(object: T, key: KeyOf.Deep<T>): U | undefined
export function getObjectProperty<T extends object, U extends any>(object: T, key: KeyOf.Deep<T>, fallback: U): U
export function getObjectProperty<T extends object, U extends any>(object: T, key: string): U | undefined
export function getObjectProperty<T extends object, U extends any>(object: T, key: string, fallback: U): U
export function getObjectProperty<T extends object, U extends any>(object: T, key: KeyOf.Deep<T>, fallback?: U): U | undefined {
  switch (typeof key) {
    case 'number':
    case 'symbol':
      return object[key] as U
    case 'string':
      if (key.includes('.')) {
        let keys: string[], lkey: string, target: any | undefined

        target = getObjectPropertyDotKeyTarget(object, key)
        if (!target) return fallback

        keys = key.split('.')
        lkey = keys[keys.length - 1].replace(REGEXP_SQUARE_BRACKETS, '')

        return target[lkey]
      }

      if (Object.keys(object).includes(key)) {
        // @ts-ignore
        return object[key]
      }

      return fallback
  }
}

/**
 * Gets the target of an object property dot key.
 *
 * @template T The object interface.
 * @template U The parent interface.
 */
function getObjectPropertyDotKeyTarget<T extends object, U extends object>(object: T, key: string): U | undefined {
  let keys: string[], target: any | Error

  keys = key.split('.')
  target = object

  for (let i = 0; i < keys.length; i++) {
    let key: string

    if (i >= keys.length - 1) {
      continue
    }

    key = keys[i]
    key = key.replace(REGEXP_SQUARE_BRACKETS, '')

    target = tc(() => target[key])
    if (target instanceof Error) return undefined
  }

  return target
}

/**
 * Merges multiple objects without touching the target.
 *
 * @template T the object interface.
 */
export function mergeObjects<T extends object>(target: T, ...sources: object[]): T {
  return merge(cloneDeepObject(target), ...sources.map((v: object) => cloneDeepObject(v)))
}

/**
 * Creates a new object without the omitted properties of T.
 *
 * @template T The object interface.
 */
export function omitObjectProperties<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
  let clone: T = cloneShallowObject(object)

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
  let pick: Pick<T, K> = {} as any

  for (let key of keys) {
    if (key in object) {
      pick[key] = object[key]
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
export function setObjectProperty<T extends object, U extends any>(object: T, key: KeyOf.Deep<T>, value: U): void | Error
export function setObjectProperty<T extends object, U extends any>(object: T, key: string, value: U): void | Error
export function setObjectProperty<T extends object, U extends any>(object: T, key: KeyOf.Deep<T>, value: U): void | Error {
  switch (typeof key) {
    case 'number':
    case 'symbol':
      // @ts-ignore
      object[key] = value
      break
    case 'string':
      if (key.includes('.')) {
        let keys: string[], target: any | Error, lkey: string

        keys = key.split('.')
        target = object

        for (let i = 0; i < keys.length; i++) {
          let key: string

          if (i >= keys.length - 1) {
            continue
          }

          key = keys[i]
          key = key.replace(REGEXP_SQUARE_BRACKETS, '')

          switch (typeof target[key]) {
            case 'object':
              target = target[key]
              continue
            case 'undefined':
              target[key] = keys[i + 1].includes('[') ? [] : {}
              target = target[key]

              continue
            default:
              return new Error(`The value type is nor undefined nor object.`)
          }
        }

        lkey = keys[keys.length - 1].replace(REGEXP_SQUARE_BRACKETS, '')
        target[lkey] = value

        return
      }

      // @ts-ignore
      object[key] = value

      break
  }
}

export function convertObjectToFormData<T extends object>(object: T): FormData {
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

/**
 * Checks whether the object has the property or not.
 *
 * @template T The object interface.
 */
export function hasObjectProperty<T extends object>(object: T, key: KeyOf.Deep<T>): boolean
export function hasObjectProperty<T extends object>(object: T, key: string): boolean
export function hasObjectProperty<T extends object>(object: T, key: KeyOf.Deep<T>): boolean {
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
export function isObject<T extends object>(value: any): value is T {
  if (value === null) {
    return false
  }

  if (Array.isArray(value)) {
    return false
  }

  return typeof value === 'object'
}

/**
 * Checks if value is a plain object.
 */
export function isPlainObject<T extends object>(value: any): value is T {
  if (typeof value !== 'object') {
    return false
  }

  if (typeof value?.toString !== 'function') {
    return false
  }

  return value.toString() === '[object Object]'
}
