import {
  DEFAULT_DELETE_OBJECT_PROPERTIES_PREDICATE,
  DEFAULT_OMIT_OBJECT_PROPERTIES_PREDICATE,
  DEFAULT_PICK_OBJECT_PROPERTIES_PREDICATE,
  REGEXP_LEFT_SQUARE_BRACKET_WITHOUT_LEADING_DOT,
  REGEXP_SQUARE_BRACKETS
} from '../definitions/constants.js'
import {
  CloneObjectOptions,
  DeleteObjectPropertiesOptions,
  FlattenObjectOptions,
  OmitObjectPropertiesOptions,
  PickObjectPropertiesOptions
} from '../definitions/interfaces.js'
import { DeleteObjectPropertiesPredicate, KeyOf, OmitObjectPropertiesPredicate, PickObjectPropertiesPredicate } from '../definitions/types.js'
import { isArray } from './array-utils.js'

/**
 * Creates a copy of an object.
 * Optionally the copy can be deep.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function cloneObject<T extends object>(object: T, options?: CloneObjectOptions): T {
  let clone: T = {} as T

  if (options?.deep !== true) {
    return { ...object }
  }

  if (!isObjectClonable(object)) {
    return object
  }

  if (isArray(object)) {
    clone = [] as T
  }

  for (let key in object) {
    let value: any = object[key]

    if (isObjectClonable(value)) {
      clone[key] = cloneObject<any>(value, options)
      continue
    }

    clone[key] = value
  }

  return clone
}

/**
 * Copies a property from one object to another. The key supports bracket and dot notation.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function copyObjectProperty<T1 extends object, T2 extends object, T extends T1 & T2>(source: T, key: KeyOf.Deep<T>, target: T): void | Error
export function copyObjectProperty<T1 extends object, T2 extends object, T extends T1 & T2>(source: T, key: string, target: T): void | Error
export function copyObjectProperty<T1 extends object, T2 extends object, T extends T1 & T2>(source: T, key: KeyOf.Deep<T>, target: T): void | Error {
  return setObjectProperty(target, key, getObjectProperty(source, key))
}

/**
 * Deletes a property from an object. The key supports bracket and dot notation.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
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
        let target: any, keys: string[], lkey: string

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

/**
 * Deletes the properties of an object that either match the predicate or are in the list of keys. The keys support bracket and dot notation.
 * Optionally deletes deep properties as well.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function deleteObjectProperties<T extends object>(
  object: T,
  predicate: DeleteObjectPropertiesPredicate,
  options: DeleteObjectPropertiesOptions & { deep: true }
): void
export function deleteObjectProperties<T extends object>(
  object: T,
  predicate: DeleteObjectPropertiesPredicate<T>,
  options?: DeleteObjectPropertiesOptions
): void
export function deleteObjectProperties<T extends object>(object: T, keys: KeyOf.Deep<T>[]): void
export function deleteObjectProperties<T extends object>(object: T, keys: KeyOf.Shallow<T>[]): void
export function deleteObjectProperties<T extends object>(object: T, keys: string[]): void
export function deleteObjectProperties<T extends object>(object: T, ...args: any[]): void {
  let keys: string[] | undefined, predicate: DeleteObjectPropertiesPredicate, options: DeleteObjectPropertiesOptions | undefined

  keys = typeof args[0] === 'object' ? args[0] : undefined
  predicate = typeof args[0] === 'function' ? args[0] : DEFAULT_DELETE_OBJECT_PROPERTIES_PREDICATE
  options = args[1]

  if (keys) {
    for (let key of keys) {
      deleteObjectProperty(object, key)
    }

    return
  }

  for (let key in object) {
    let value: any = object[key]

    if (predicate(object, key, value, keys)) {
      delete object[key]
      continue
    }

    if (options?.deep && isPlainObject(value)) {
      deleteObjectProperties(value, predicate)
    }
  }
}

/**
 * Flattens an object into a single-depth object with dot notation keys.
 * Optionally flattens arrays as well.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function flattenObject<T extends object>(object: T, options?: FlattenObjectOptions, parents: string[] = []): Record<string, any> {
  let flat: Record<string, any> = {}

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

/**
 * Returns a property from an object. The key supports bracket and dot notation.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function getObjectProperty<T extends object, U>(object: T, key: KeyOf.Deep<T>): U | undefined
export function getObjectProperty<T extends object, U>(object: T, key: KeyOf.Deep<T>, fallback: U): U
export function getObjectProperty<T extends object, U>(object: T, key: string): U | undefined
export function getObjectProperty<T extends object, U>(object: T, key: string, fallback: U): U
export function getObjectProperty<T extends object, U>(object: T, key: KeyOf.Deep<T>, fallback?: U): U | undefined {
  switch (typeof key) {
    case 'number':
    case 'symbol':
      return object[key] as U
    case 'string':
      if (key.includes('.')) {
        let keys: string[], lkey: string, target: any

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

/**
 * Merges two or more objects into a single object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function mergeObjects<T extends object, U extends object = T>(target: T, ...sources: Record<PropertyKey, any>[]): U {
  let clone: any = cloneObject(target, { deep: true })

  for (let source of sources) {
    for (let key in source) {
      let tp: any, sp: any

      tp = getObjectProperty(clone, key, {})
      sp = source[key]

      if (isArray(sp)) {
        tp = getObjectProperty(clone, key, [])
      }

      if (isObjectClonable(sp)) {
        clone[key as keyof T] = mergeObjects(tp, cloneObject(sp, { deep: true }))
        continue
      }

      clone[key as keyof T] = sp
    }
  }

  return clone
}

/**
 * Returns a new object without the properties that match the predicate or are in the list of keys. The keys support bracket and dot notation.
 * Optionally omits deep properties as well.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function omitObjectProperties<T extends object, U extends object = T>(
  object: T,
  predicate: OmitObjectPropertiesPredicate,
  options: OmitObjectPropertiesOptions & { deep: true }
): U
export function omitObjectProperties<T extends object, U extends object = T>(
  object: T,
  predicate: OmitObjectPropertiesPredicate<T>,
  options?: OmitObjectPropertiesOptions
): U
export function omitObjectProperties<T extends object, K extends KeyOf.Deep<T> = KeyOf.Deep<T>>(object: T, keys: K[]): Omit<T, K>
export function omitObjectProperties<T extends object, K extends KeyOf.Shallow<T> = KeyOf.Shallow<T>>(object: T, keys: K[]): Omit<T, K>
export function omitObjectProperties<T extends object, U extends object = T>(object: T, keys: string[]): U
export function omitObjectProperties<T extends object, U extends object = T>(object: T, ...args: any[]): U {
  let keys: string[] | undefined, predicate: OmitObjectPropertiesPredicate, options: OmitObjectPropertiesOptions | undefined, clone: T & U

  keys = typeof args[0] === 'object' ? args[0] : undefined
  predicate = typeof args[0] === 'function' ? args[0] : DEFAULT_OMIT_OBJECT_PROPERTIES_PREDICATE
  options = args[1]

  clone = cloneObject(object, options) as T & U

  if (typeof keys === 'object') {
    deleteObjectProperties(clone, keys)
  }

  if (typeof keys === 'undefined') {
    deleteObjectProperties(clone, predicate, options as any)
  }

  return clone
}

/**
 * Returns a new object with only the properties that match the predicate or are in the list of keys. The keys support bracket and dot notation.
 * Optionally picks deep properties as well.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function pickObjectProperties<T extends object, U extends object = T>(
  object: T,
  predicate: PickObjectPropertiesPredicate,
  options: PickObjectPropertiesOptions & { deep: true }
): U
export function pickObjectProperties<T extends object, U extends object = T>(
  object: T,
  predicate: PickObjectPropertiesPredicate,
  mode?: PickObjectPropertiesOptions
): U
export function pickObjectProperties<T extends object, K extends KeyOf.Deep<T> = KeyOf.Deep<T>>(object: T, keys: K[]): Pick<T, K>
export function pickObjectProperties<T extends object, K extends KeyOf.Shallow<T> = KeyOf.Shallow<T>>(object: T, keys: K[]): Pick<T, K>
export function pickObjectProperties<T extends object, U extends object = T>(object: T, keys: string[]): U
export function pickObjectProperties<T extends object, U extends object = T>(object: T, ...args: any[]): U {
  let keys: string[] | undefined, predicate: PickObjectPropertiesPredicate, options: PickObjectPropertiesOptions | undefined, clone: T & U

  keys = typeof args[0] === 'object' ? args[0] : undefined
  predicate = typeof args[0] === 'function' ? args[0] : DEFAULT_PICK_OBJECT_PROPERTIES_PREDICATE
  options = args[1]

  clone = {} as T & U

  if (keys) {
    for (let key of keys) {
      setObjectProperty(clone, key, getObjectProperty(object, key))
    }

    return clone
  }

  for (let key in object) {
    let value: any = object[key]

    if (predicate(clone, key, value, keys)) {
      clone[key] = value
      continue
    }

    if (options?.deep && isPlainObject(value)) {
      deleteObjectProperties(value, predicate)
    }
  }

  return clone
}

/**
 * Sets a property on an object. The key supports bracket and dot notation.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
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
        let keys: string[], target: any, lkey: string

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

/**
 * Checks if an object has a property. The key supports bracket and dot notation.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
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
 * Checks if an unknown value is an object. A value is considered an object if it is typeof "object", not null and not an array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function isObject<T extends object>(value: unknown): value is T {
  if (value === null) {
    return false
  }

  if (Array.isArray(value)) {
    return false
  }

  return typeof value === 'object'
}

/**
 * Checks if an object is clonable. An object is considered clonable if it is an array or a plain object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function isObjectClonable<T extends object>(object: T): boolean {
  return isArray(object) || isPlainObject(object)
}

/**
 * Checks if an object is flattenable. An object is considered flattenable if it is an array or a plain object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function isObjectFlattenable<T extends object>(object: T, options?: FlattenObjectOptions): boolean {
  if (options?.array && isArray(object)) {
    return true
  }

  return isPlainObject(object)
}

/**
 * Checks if an object has keys.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function isObjectKeysPopulated<T extends object>(object: T): boolean {
  return Object.keys(object).length > 0
}

/**
 * Checks if an object has values.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function isObjectValuesPopulated<T extends object>(object: T): boolean {
  return Object.values(object).length > 0
}

/**
 * Checks if an unknown value is a plain object. A value is considered a plain object if it matches the default object prototype, it is typeof "object" and not null.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/object)
 */
export function isPlainObject<T extends object>(value: unknown): value is T {
  if (value === null) {
    return false
  }

  if (typeof value !== 'object') {
    return false
  }

  return Object.getPrototypeOf(value) === Object.prototype
}
