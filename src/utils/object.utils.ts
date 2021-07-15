import { tc } from '../modules/tc'

/**
 * @category Utility
 */
export class ObjectUtils {
  /** @internal */
  private static plain: object = {}

  /** @hidden */
  constructor() {}

  /**
   * Clones an object
   *
   * @template T Any object
   */
  static clone<T extends object>(object: T): T {
    return JSON.parse(JSON.stringify(object))
  }

  /**
   * Gets a key from an object, supports dot notation
   *
   * @template T Any object
   * @template U Any value
   */
  static get<T extends object, U extends any>(object: T, key: string | keyof T, fallback?: U): U | undefined {
    switch (typeof key) {
      case 'number':
      case 'symbol':
        return object[key] as U
      case 'string':
        if (key.includes('.')) {
          let value: U | Error

          value = tc(() => key.split('.').reduce((r: any, k: string) => r[k.replace(/[\[\]]/g, '')], object))
          if (value instanceof Error) return fallback

          return value
        }

        return object[key as keyof T] as U
    }
  }

  /**
   * Sets a value to a key in an object, supports dot notation
   *
   * @template T Any object
   * @template U Any value
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

          parent = tc(() => keys.reduce((r: any, k: string, i: number) => (i < keys.length - 1 ? r[k] : r), object))
          if (parent instanceof Error) return

          parent[keys[keys.length - 1]] = value

          return
        }

        object[key as keyof T] = value as any

        break
    }
  }

  /**
   * Creates a new object with only the picked keys of T
   *
   * @template T Any object
   */
  static pick<T extends object>(object: T, keys: (keyof T)[]): Pick<T, keyof T> {
    let output: Pick<T, keyof T>

    // @ts-ignore
    output = {}
    keys.forEach((k: keyof T) => object[k])

    return output
  }

  /**
   * Creates an array of values of picked keys of T
   *
   * @template T Any object
   */
  static pickToArray<T extends object>(object: T, keys: (keyof T)[]): Pick<T, keyof T>[] {
    let output: Pick<T, keyof T>[]

    output = []
    Object.entries(object).forEach((v: [string, any]) => keys.includes(v[0] as keyof T) && output.push(v[1]))

    return output
  }

  /**
   * Creates a new object without the omitted keys of T
   *
   * @template T Any object
   */
  static omit<T extends object>(object: T, keys: (keyof T)[]): Omit<T, keyof T> {
    let clone: T

    clone = { ...object }
    keys.forEach((k: keyof T) => delete clone[k])

    return clone
  }

  /**
   * Checks whether the object has the key or not
   *
   * @template T Any object
   */
  static has<T extends object>(object: T, key: string | keyof T): boolean {
    return this.get(object, key, this.plain) !== this.plain
  }

  /**
   * Checks if the object has keys
   *
   * @template T Any object
   */
  static hasKeys<T extends object>(object: T): boolean {
    return Object.keys(object).length > 0
  }

  /**
   * Checks if the object has values
   *
   * @template T Any object
   */
  static hasValues<T extends object>(object: T): boolean {
    return Object.values(object).length > 0
  }
}
