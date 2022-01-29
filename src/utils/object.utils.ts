import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import { Environment } from '../modules/environment'
import { tc } from '../modules/tc'

/**
 * Utils for anything related to objects.
 *
 * @category Utility
 */
export class ObjectUtils {
  /** @internal */
  private static plain: object = {}

  /** @hidden */
  constructor() {}

  /**
   * Clones an object.
   *
   * @template T The object interface.
   */
  static clone<T extends object>(object: T, native: boolean = true): T {
    return native ? JSON.parse(JSON.stringify(object)) : cloneDeep(object)
  }

  /**
   * Deletes a key from an object, supports dot notation.
   *
   * @template T The object interface.
   * @template U The value interface or type.
   */
  static delete<T extends object>(object: T, key: string | keyof T): void {
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
  static get<T extends object, U extends any>(object: T, key: string | keyof T, fallback: U, verbose: boolean = false): U {
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
  static merge<T extends object>(target: T, ...sources: object[]): T {
    return merge(this.clone(target), ...sources.map((v: object) => this.clone(v)))
  }

  /**
   * Creates a new object without the omitted keys of T.
   *
   * @template T The object interface.
   */
  static omit<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
    let clone: T

    clone = { ...object }
    keys.forEach((k: keyof T) => delete clone[k])

    return clone
  }

  /**
   * Creates a new object with only the picked keys of T.
   *
   * @template T The object interface.
   */
  static pick<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
    let output: Pick<T, K>

    output = {} as any
    keys.forEach((k: keyof T) => {
      if (this.has(object, k)) {
        // @ts-ignore
        output[k] = object[k]
      }
    })

    return output
  }

  /**
   * Creates an array of values of picked keys of T.
   *
   * @template T The object interface.
   */
  static pickToArray<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K>[] {
    let output: Pick<T, keyof T>[]

    output = []
    Object.entries(object).forEach((v: [string, any]) => keys.includes(v[0] as any) && output.push(v[1]))

    return output
  }

  /**
   * Sets a value to a key in an object, supports dot notation.
   *
   * @template T The object interface.
   * @template U The value interface or type.
   */
  static set<T extends object, U extends any>(object: T, key: string | keyof T, value: U): void {
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

  static toFormData<T extends object>(object: T): FormData {
    let data: FormData

    data = new FormData()

    Object.entries(object).forEach(([k, v]: [string, any]) => {
      switch (true) {
        case Environment.isFileDefined && v instanceof File:
          data.append(k, v)
          break
        default:
          switch (typeof v) {
            case 'bigint':
            case 'boolean':
            case 'number':
              data.append(k, v.toString())
              break
            case 'function':
            case 'symbol':
            case 'undefined':
              break
            case 'object':
              let stringified: string | Error

              stringified = tc(() => JSON.stringify(v))
              if (stringified instanceof Error) break

              data.append(k, stringified)

              break
            case 'string':
              data.append(k, v)
              break
          }

          break
      }
    })

    return data
  }

  /**
   * Checks whether the object has the key or not.
   *
   * @template T The object interface.
   */
  static has<T extends object>(object: T, key: string | keyof T): boolean {
    return this.get(object, key, this.plain) !== this.plain
  }

  /**
   * Checks if the object has keys.
   *
   * @template T The object interface.
   */
  static hasKeys<T extends object>(object: T): boolean {
    return Object.keys(object).length > 0
  }

  /**
   * Checks if the object has values.
   *
   * @template T The object interface.
   */
  static hasValues<T extends object>(object: T): boolean {
    return Object.values(object).length > 0
  }

  /**
   * Checks whether the object is really an object or not.
   */
  static is(value: any): value is object {
    return typeof value === 'object' && !Array.isArray(value)
  }
}
