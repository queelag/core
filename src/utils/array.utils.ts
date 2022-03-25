/**
 * Utils for anything related to arrays.
 *
 * @category Utility
 */
export class ArrayUtils {
  /**
   * Returns the symmetric difference between the T arrays.
   */
  static difference<T>(arrays: T[][]): T[] {
    return arrays.reduce((r: T[], v: T[]) => [...r, ...v.filter((v: T) => !r.includes(v) && arrays.filter((w: T[]) => w.includes(v)).length <= 1)], [])
  }

  /**
   * Returns the intersection between the T arrays.
   */
  static intersection<T>(arrays: T[][]): T[] {
    return arrays.reduce((r: T[], v: T[]) => [...r, ...v.filter((v: T) => !r.includes(v) && arrays.every((w: T[]) => w.includes(v)))], [])
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
  static remove<T>(array: T[], callbackfn: (v: T) => boolean): T[] {
    return array.reduce((r: T[], v: T) => {
      let removable: boolean

      removable = callbackfn(v)
      if (removable) return r

      r.push(v)

      return r
    }, [])
  }

  /**
   * Removes every duplicate using Set.
   */
  static uniq<T>(array: T[], callbackfn?: (r: T[], v: T) => boolean): T[] {
    return callbackfn
      ? array.reduce((r: T[], v: T) => {
          let pushed: boolean

          pushed = callbackfn(r, v)
          if (pushed) return r

          r.push(v)

          return r
        }, [])
      : [...new Set(array)]
  }
}
