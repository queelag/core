import { ObjectUtils } from './object.utils'

/**
 * Utils for anything related to arrays.
 *
 * @category Utility
 */
export class ArrayUtils {
  /**
   * Clones an array.
   */
  static clone<T>(array: T[]): T[] {
    return array.reduce((r: T[], v: T) => {
      switch (typeof v) {
        case 'bigint':
        case 'boolean':
        case 'function':
        case 'number':
        case 'string':
        case 'symbol':
        case 'undefined':
          r.push(v)
          break
        case 'object':
          if (Array.isArray(v)) {
            r.push(this.clone(v) as any)
            break
          }

          // @ts-ignore
          r.push(ObjectUtils.clone(v))

          break
      }

      return r
    }, [])
  }

  /**
   * Gets the last T item, falls back to dummy if defined and if not returns undefined.
   */
  static last<T>(array: T[], dummy?: T): T | undefined {
    return array[array.length - 1] || dummy
  }

  /**
   * Removes every T item matching the callbackfn result.
   */
  static remove<T>(array: T[], callbackfn: (v: T) => boolean): void {
    array.forEach((v: T, k: number) => {
      let removable: boolean

      removable = callbackfn(v)
      if (!removable) return

      array.splice(k, 1)
    })
  }

  /**
   * Removes every duplicate using Set.
   */
  static uniq<T>(array: T[]): T[] {
    return [...new Set(array)]
  }
}
