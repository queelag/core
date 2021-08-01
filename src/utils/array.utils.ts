export class ArrayUtils {
  static last<T>(array: T[]): T | undefined {
    return array[array.length - 1]
  }

  static uniq<T>(array: T[]): T[] {
    return [...new Set(array)]
  }
}
