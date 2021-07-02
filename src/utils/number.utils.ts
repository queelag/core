export class NumberUtils {
  static absolute(value: number): number {
    return value < 0 ? value * -1 : value
  }

  static limit(value: number, minimum: number = Number.MIN_SAFE_INTEGER, maximum: number = Number.MAX_SAFE_INTEGER): number {
    return value >= minimum && value <= maximum ? value : value >= minimum && value > maximum ? maximum : value < minimum && value <= maximum ? minimum : 0
  }

  static parseFloat(value: any, fallback: number = 0): number {
    return isNaN(parseFloat(value)) ? fallback : parseFloat(value)
  }

  static pickLowest(...values: number[]): number {
    return values.reduce((r: number, v: number) => (v < r ? v : r), 0)
  }

  static range(a: number, b: number): number {
    return a > b ? a - b : b - a
  }

  static isMultipleOf(value: number, of: number, decimals: number = 0): boolean {
    return this.toFixedNumber(value / of, decimals) % 1 === 0
  }

  static toFixedNumber(value: number, decimals: number): number {
    return this.parseFloat(value.toFixed(decimals))
  }
}
