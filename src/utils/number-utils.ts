import { DEFAULT_GET_NUMBER_PERCENTAGE_MAX, DEFAULT_GET_NUMBER_PERCENTAGE_MIN } from '../definitions/constants.js'
import { GetLimitedNumberOptions, GetNumberPercentageOptions } from '../definitions/interfaces.js'
import { tc } from '../functions/tc.js'
import { isStringFloat, isStringInt } from './string-utils.js'

/**
 * Returns the absolute value of a number.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function getAbsoluteNumber(number: number): number {
  if (Object.is(number, -0)) {
    return 0
  }

  if (number < 0) {
    return number * -1
  }

  return number
}

/**
 * Returns the number with a fixed number of decimals.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function getFixedNumber(number: number, decimals: number): number {
  return parseNumber(number.toFixed(decimals))
}

/**
 * Returns the distance between two numbers.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function getNumbersDistance(a: number, b: number): number {
  return a > b ? a - b : b - a
}

/**
 * Returns the number between a minimum and maximum value.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function getLimitedNumber(number: number, options?: GetLimitedNumberOptions): number {
  let min: number, max: number

  min = options?.min ?? Number.MIN_SAFE_INTEGER
  max = options?.max ?? Number.MAX_SAFE_INTEGER

  if (number >= min && number <= max) {
    return number
  }

  if (number < min) {
    return min
  }

  return max
}

/**
 * Returns the percentage of a number between a minimum and maximum value.
 * Optionally the percentage can be rounded.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function getNumberPercentage(number: number, options?: GetNumberPercentageOptions): number {
  let min: number, max: number, percentage: number

  min = options?.min ?? DEFAULT_GET_NUMBER_PERCENTAGE_MIN
  max = options?.max ?? DEFAULT_GET_NUMBER_PERCENTAGE_MAX

  percentage = (number / (max - min)) * 100
  percentage = options?.round ? Math.round(percentage) : percentage

  return percentage
}

/**
 * Returns the highest number in an array of numbers.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function getHighestNumber(numbers: number[]): number
export function getHighestNumber(...numbers: number[]): number
export function getHighestNumber(...args: any[]): number {
  let numbers: number[], highest: number

  numbers = typeof args[0] === 'number' ? args : args[0]
  highest = Number.MIN_SAFE_INTEGER

  for (let number of numbers) {
    highest = number > highest ? number : highest
  }

  return highest
}

/**
 * Returns the lowest number in an array of numbers.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function getLowestNumber(numbers: number[]): number
export function getLowestNumber(...numbers: number[]): number
export function getLowestNumber(...args: any[]): number {
  let numbers: number[], lowest: number

  numbers = typeof args[0] === 'number' ? args : args[0]
  lowest = Number.MAX_SAFE_INTEGER

  for (let number of numbers) {
    lowest = number < lowest ? number : lowest
  }

  return lowest
}

/**
 * Parses an unknown value to a bigint.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function parseBigInt(value: unknown, fallback?: bigint): bigint {
  let parsed: bigint | Error

  switch (typeof value) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string':
      parsed = tc(() => BigInt(value))
      if (parsed instanceof Error) return fallback ?? BigInt(0)

      break
    default:
      parsed = fallback ?? BigInt(0)
      break
  }

  return parsed
}

/**
 * Parses an unknown value to a number.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function parseNumber(value: unknown, fallback: number = 0): number {
  let string: string = String(value)

  if (string.includes('.')) {
    return isStringFloat(string) ? parseFloat(string) : fallback
  }

  return isStringInt(string) ? parseInt(string) : fallback
}

/**
 * Checks if the number is even.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function isNumberEven(number: number): boolean {
  return number % 2 == 0
}

/**
 * Checks if the number is a multiple of another number.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function isNumberMultipleOf(number: number, of: number): boolean {
  return number % of === 0
}

/**
 * Checks if the number is odd.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/number)
 */
export function isNumberOdd(number: number): boolean {
  return Math.abs(number % 2) == 1
}
