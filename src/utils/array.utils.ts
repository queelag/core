/**
 * Utils for anything related to arrays.
 *
 * @category Utility
 */
export class ArrayUtils {
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
