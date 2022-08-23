import { tc } from '../functions/tc'

/**
 * Returns an always positive number.
 */
export function getAbsoluteNumber(number: number): number {
  return number < 0 ? number * -1 : number
}

/**
 * Calculates the distance between two numbers.
 */
export function getNumbersDistance(a: number, b: number): number {
  return a > b ? a - b : b - a
}

/**
 * Limits a number between a minimum and maximum.
 */
export function getLimitedNumber(number: number, minimum: number = Number.MIN_SAFE_INTEGER, maximum: number = Number.MAX_SAFE_INTEGER): number {
  return number >= minimum && number <= maximum ? number : number >= minimum && number > maximum ? maximum : number < minimum && number <= maximum ? minimum : 0
}

/**
 * Calculates the percentage of a number between minimum and maximum.
 */
export function getNumberPercentage(number: number, minimum: number = 0, maximum: number = 100, round: boolean = false): number {
  return round ? Math.round((number / (maximum - minimum)) * 100) : (number / (maximum - minimum)) * 100
}

/**
 * Picks the highest number in the array.
 */
export function getHighestNumber(numbers: number[]): number {
  return numbers.reduce((r: number, v: number) => (v > r ? v : r), Number.MIN_SAFE_INTEGER)
}

/**
 * Picks the lowest number in the array.
 */
export function getLowestNumber(numbers: number[]): number {
  return numbers.reduce((r: number, v: number) => (v < r ? v : r), Number.MAX_SAFE_INTEGER)
}

/**
 * Parses to a BigInt safely.
 */
export function parseBigInt(value: string | number | bigint | boolean, fallback: BigInt = 0n): BigInt {
  let parsed: BigInt | Error

  parsed = tc(() => BigInt(value))
  if (parsed instanceof Error) return fallback

  return parsed
}

/**
 * Parses to a float or int safely.
 */
export function parseNumber(string: string, fallback: number = 0): number {
  if (string.includes('.')) {
    return isStringFloat(string) ? parseFloat(string) : fallback
  }

  return isStringInt(string) ? parseInt(string) : fallback
}

/**
 * Re-parses a number after setting the correct number of decimals, this is to avoid a bug in ES math.
 */
export function toFixedNumber(number: number, decimals: number): number {
  return parseNumber(number.toFixed(decimals))
}

/**
 * Checks whether a number is even.
 */
export function isNumberEven(number: number): boolean {
  return number % 2 == 0
}

/**
 * Checks whether a number is a multiple of of.
 */
export function isNumberMultipleOf(number: number, of: number, decimals: number = 0): boolean {
  return toFixedNumber(number / of, decimals) % 1 === 0
}

/**
 * Checks whether a number is odd.
 */
export function isNumberOdd(number: number): boolean {
  return Math.abs(number % 2) == 1
}

/**
 * Checks whether a value is parsable as float.
 */
export function isStringFloat(string: string): boolean {
  return !isNaN(parseFloat(string))
}

/**
 * Checks whether a value is parsable as int.
 */
export function isStringInt(string: string): boolean {
  return !isNaN(parseInt(string))
}
