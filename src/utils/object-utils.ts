import { REGEXP_LEFT_SQUARE_BRACKET_WITHOUT_LEADING_DOT, REGEXP_SQUARE_BRACKETS } from '../definitions/constants.js'
import { FlattenObjectOptions } from '../definitions/interfaces.js'
import { KeyOf } from '../definitions/types.js'
import { isArray } from './array-utils.js'

export function cloneDeepObject<T extends object>(object: T): T {
  let clone: T = {} as T

  if (!isObjectClonable(object)) {
    return object
  }

  if (isArray(object)) {
    clone = [] as T
  }

  for (let key in object) {
    let value: any = object[key]

    if (isObjectClonable(value)) {
      clone[key] = cloneDeepObject<any>(value)
      continue
    }

    clone[key] = value
  }

  return clone
}

export function cloneShallowObject<T extends object>(object: T): T {
  return { ...object }
}

export function copyObjectProperty<T1 extends object, T2 extends object, T extends T1 & T2>(source: T, key: KeyOf.Deep<T>, target: T): void | Error
export function copyObjectProperty<T1 extends object, T2 extends object, T extends T1 & T2>(source: T, key: string, target: T): void | Error
export function copyObjectProperty<T1 extends object, T2 extends object, T extends T1 & T2>(source: T, key: KeyOf.Deep<T>, target: T): void | Error {
  return setObjectProperty(target, key, getObjectProperty(source, key))
}

export function deleteObjectProperty<T extends object>(object: T, key: KeyOf.Deep<T>): void
export function deleteObjectProperty<T extends object>(object: T, key: string): void
export function deleteObjectProperty<T extends object>(object: T, key: KeyOf.Deep<T>): void {
  switch (typeof key) {
    case 'number':
    case 'symbol':
      delete object[key]
      break
    case 'string':
      if (key.includes('.')) {
        let target: any | Error, keys: string[], lkey: string

        keys = key.replace(REGEXP_LEFT_SQUARE_BRACKET_WITHOUT_LEADING_DOT, '$1.[').split('.')
        lkey = keys[keys.length - 1].replace(REGEXP_SQUARE_BRACKETS, '')

        target = getObjectPropertyDotKeyTarget(object, keys)
        if (target instanceof Error) return

        delete target[lkey]

        return
      }

      delete object[key as keyof T]

      break
  }
}

export function flattenObject<T extends object>(object: T, options?: FlattenObjectOptions, parents: string[] = []): Record<PropertyKey, any> {
  let flat: Record<PropertyKey, any> = {}

  for (let key in object) {
    let value: any = object[key]

    if (isObjectFlattenable(value, options)) {
      flat = { ...flat, ...flattenObject(value, options, parents.concat(key)) }
      continue
    }

    flat[parents.concat(key).join('.')] = object[key]
  }

  return flat
}

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
        let keys: string[], lkey: string, target: any | Error

        keys = key.replace(REGEXP_LEFT_SQUARE_BRACKET_WITHOUT_LEADING_DOT, '$1.[').split('.')
        lkey = keys[keys.length - 1].replace(REGEXP_SQUARE_BRACKETS, '')

        target = getObjectPropertyDotKeyTarget(object, keys)
        if (target instanceof Error) return fallback

        return target[lkey]
      }

      if (key in object) {
        return object[key as keyof T] as U
      }

      return fallback
  }
}

function getObjectPropertyDotKeyTarget<T extends object, U extends object>(object: T, keys: string[], construct: boolean = false): U | Error {
  let target: any = object

  for (let i = 0; i < keys.length; i++) {
    let key: string

    if (i >= keys.length - 1) {
      continue
    }

    key = keys[i]
    key = key.replace(REGEXP_SQUARE_BRACKETS, '')

    switch (typeof target[key]) {
      case 'object':
        if (target[key] === null) {
          return new Error(`The target value is null.`)
        }

        target = target[key]
        continue
      case 'undefined':
        if (construct) {
          target[key] = keys[i + 1].includes('[') ? [] : {}
          target = target[key]

          continue
        }

        return new Error(`The target type is undefined.`)
      default:
        return new Error(`The target type is nor undefined nor object.`)
    }
  }

  return target
}

export function mergeObjects<T extends object>(target: T, ...sources: Record<PropertyKey, any>[]): T {
  let clone: T = cloneDeepObject(target)

  for (let source of sources) {
    for (let key in source) {
      let tp: any, sp: any

      tp = getObjectProperty(clone, key, {})
      sp = source[key]

      if (isArray(sp)) {
        tp = getObjectProperty(clone, key, [])
      }

      if (isObjectClonable(sp)) {
        clone[key as keyof T] = mergeObjects(tp, cloneDeepObject(sp))
        continue
      }

      clone[key as keyof T] = sp
    }
  }

  return clone
}

export function omitObjectProperties<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
  let clone: T = cloneShallowObject(object)

  for (let key of keys) {
    delete clone[key]
  }

  return clone
}

export function pickObjectProperties<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  let pick: Pick<T, K> = {} as any

  for (let key of keys) {
    if (key in object) {
      pick[key] = object[key]
    }
  }

  return pick
}

export function setObjectProperty<T extends object, U>(object: T, key: KeyOf.Deep<T>, value: U): void | Error
export function setObjectProperty<T extends object, U>(object: T, key: string, value: U): void | Error
export function setObjectProperty<T extends object, U>(object: T, key: KeyOf.Deep<T>, value: U): void | Error {
  switch (typeof key) {
    case 'number':
    case 'symbol':
      object[key as keyof T] = value as T[keyof T]
      break
    case 'string':
      if (key.includes('.')) {
        let keys: string[], target: any | Error, lkey: string

        keys = key.replace(REGEXP_LEFT_SQUARE_BRACKET_WITHOUT_LEADING_DOT, '$1.[').split('.')
        lkey = keys[keys.length - 1].replace(REGEXP_SQUARE_BRACKETS, '')

        target = getObjectPropertyDotKeyTarget(object, keys, true)
        if (target instanceof Error) return target

        target[lkey] = value

        break
      }

      object[key as keyof T] = value as T[keyof T]

      break
  }
}

export function deleteDeepObjectUndefinedProperties<T extends object>(object: T): T {
  let clone: T = cloneShallowObject(object)

  for (let key in clone) {
    let value: any = clone[key]

    if (isPlainObject(value)) {
      clone[key] = deleteDeepObjectUndefinedProperties<any>(value)
      continue
    }

    if (typeof value === 'undefined') {
      delete clone[key]
    }
  }

  return clone
}

export function deleteShallowObjectUndefinedProperties<T extends object>(object: T): T {
  let clone: T = cloneShallowObject(object)

  for (let key in clone) {
    let value: any = clone[key]

    if (typeof value === 'undefined') {
      delete clone[key]
    }
  }

  return clone
}

export function hasObjectProperty<T extends object>(object: T, key: KeyOf.Deep<T>): boolean
export function hasObjectProperty<T extends object>(object: T, key: string): boolean
export function hasObjectProperty<T extends object>(object: T, key: KeyOf.Deep<T>): boolean {
  let symbol: symbol

  // symbols are always unique
  symbol = Symbol()

  return getObjectProperty(object, key, symbol) !== symbol
}

export function isObject<T extends object>(value: any): value is T {
  if (value === null) {
    return false
  }

  if (Array.isArray(value)) {
    return false
  }

  return typeof value === 'object'
}

export function isObjectClonable<T extends object>(object: T): boolean {
  return isArray(object) || isPlainObject(object)
}

export function isObjectFlattenable<T extends object>(object: T, options?: FlattenObjectOptions): boolean {
  if (options?.array && isArray(object)) {
    return true
  }

  return isPlainObject(object)
}

export function isObjectKeysPopulated<T extends object>(object: T): boolean {
  return Object.keys(object).length > 0
}

export function isObjectValuesPopulated<T extends object>(object: T): boolean {
  return Object.values(object).length > 0
}

export function isPlainObject<T extends object>(value: any): value is T {
  if (value === null) {
    return false
  }

  if (typeof value !== 'object') {
    return false
  }

  return Object.getPrototypeOf(value) === Object.prototype
}
