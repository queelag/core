/**
 * Utils for anything related to arrays.
 *
 * @category Utility
 */
export class ArrayUtils {
  /**
   * Gets the last T item of an array, falls back to dummy if defined and if not returns undefined.
   */
  static last<T>(array: T[], dummy?: T): T | undefined {
    return array[array.length - 1] || dummy
  }

  /**
   * Removes duplicates from an array using Set.
   */
  static uniq<T>(array: T[]): T[] {
    return [...new Set(array)]
  }
}
