import { tc } from '../modules/tc'

export class ObjectUtils {
  private static plain: object = {}

  static clone<T extends object>(object: T): T {
    return JSON.parse(JSON.stringify(object))
  }

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

  static pick<T extends object>(object: T, keys: (keyof T)[]): Pick<T, keyof T> {
    let output: Pick<T, keyof T>

    // @ts-ignore
    output = {}
    keys.forEach((k: keyof T) => object[k])

    return output
  }

  static pickToArray<T extends object>(object: T, keys: (keyof T)[]): Pick<T, keyof T>[] {
    let output: Pick<T, keyof T>[]

    output = []
    Object.entries(object).forEach((v: [string, any]) => keys.includes(v[0] as keyof T) && output.push(v[1]))

    return output
  }

  static omit<T extends object>(object: T, keys: (keyof T)[]): Omit<T, keyof T> {
    let clone: T

    clone = { ...object }
    keys.forEach((k: keyof T) => delete clone[k])

    return clone
  }

  static has<T extends object>(object: T, key: string | keyof T): boolean {
    return this.get(object, key, this.plain) !== this.plain
  }
}
