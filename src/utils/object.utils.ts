import { tc } from '../modules/tc'

export class ObjectUtils {
  private static plain: object = {}

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

  static omit<T extends object, K extends keyof T>(object: T, ...keys: K[]): Omit<T, K> {
    let clone: T

    clone = { ...object }
    keys.forEach((v: K) => delete clone[v])

    return clone
  }

  static has<T extends object>(object: T, key: string | keyof T): boolean {
    return this.get(object, key, this.plain) !== this.plain
  }
}
