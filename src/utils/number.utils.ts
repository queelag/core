import { tc } from '../functions/tc'
import { isStringFloat, isStringInt } from './string.utils'

/**
 * Returns an always positive number.
 */
export function getAbsoluteNumber(number: number): number {
  return number === -0 ? 0 : number < 0 ? number * -1 : number
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
  if (number >= minimum && number <= maximum) {
    return number
  }

  if (number < minimum) {
    return minimum
  }

  return maximum
}

/**
 * Calculates the percentage of a number between minimum and maximum.
 */
export function getNumberPercentage(number: number, minimum: number = 0, maximum: number = 100, round: boolean = false): number {
  let percentage: number

  percentage = (number / (maximum - minimum)) * 100
  percentage = round ? Math.round(percentage) : percentage

  return percentage
}

/**
 * Picks the highest number in the array.
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
 * Picks the lowest number in the array.
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
export function isNumberMultipleOf(number: number, of: number): boolean {
  return number % of === 0
}

/**
 * Checks whether a number is odd.
 */
export function isNumberOdd(number: number): boolean {
  return Math.abs(number % 2) == 1
}
