import { tc } from '../modules/tc'

/**
 * Utils for anything related to numbers.
 *
 * @category Utility
 */
export class NumberUtils {
  /** @hidden */
  constructor() {}

  /**
   * Returns an always positive number.
   */
  static absolute(value: number): number {
    return value < 0 ? value * -1 : value
  }

  /**
   * Calculates the distance between two numbers.
   */
  static distance(a: number, b: number): number {
    return a > b ? a - b : b - a
  }

  /**
   * Limits a value between a minimum and maximum.
   */
  static limit(value: number, minimum: number = Number.MIN_SAFE_INTEGER, maximum: number = Number.MAX_SAFE_INTEGER): number {
    return value >= minimum && value <= maximum ? value : value >= minimum && value > maximum ? maximum : value < minimum && value <= maximum ? minimum : 0
  }

  /**
   * Parses any value to a BigInt safely.
   */
  static parseBigInt(value: any, fallback: number = 0): BigInt {
    let parsed: BigInt | Error

    parsed = tc(() => BigInt(value))
    if (parsed instanceof Error) return BigInt(fallback)

    return parsed
  }

  /**
   * Parses any value to a float safely.
   */
  static parseFloat(value: any, fallback: number = 0): number {
    return this.isParseable(value) ? parseFloat(value) : fallback
  }

  /**
   * Parses any value to a int safely.
   */
  static parseInt(value: any, fallback: number = 0): number {
    return this.isParseable(value) ? parseInt(value) : fallback
  }

  /**
   * Picks the highest number in the array.
   */
  static pickHighest(values: number[]): number {
    return values.reduce((r: number, v: number) => (v > r ? v : r), Number.MAX_SAFE_INTEGER)
  }

  /**
   * Picks the lowest number in the array.
   */
  static pickLowest(values: number[]): number {
    return values.reduce((r: number, v: number) => (v < r ? v : r), Number.MAX_SAFE_INTEGER)
  }

  /**
   * Checks whether a value is even.
   */
  static isEven(value: number): boolean {
    return value % 2 == 0
  }

  /**
   * Checks whether value is a multiple of of.
   */
  static isMultipleOf(value: number, of: number, decimals: number = 0): boolean {
    return this.toFixed(value / of, decimals) % 1 === 0
  }

  /**
   * Checks whether a value is odd.
   */
  static isOdd(value: number): boolean {
    return Math.abs(value % 2) == 1
  }

  /**
   * Checks whether value is parseable to a float.
   */
  static isParseable(value: any): boolean {
    return !isNaN(parseInt(value))
  }

  /**
   * Re-parses a number after setting the correct number of decimals, this is to avoid a bug in ES math.
   */
  static toFixed(value: number, decimals: number): number {
    return this.parseFloat(value.toFixed(decimals))
  }
}
