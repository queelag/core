import { tc } from '../functions/tc.js'
import { isStringFloat, isStringInt } from './string-utils.js'

export function getAbsoluteNumber(number: number): number {
  if (Object.is(number, -0)) {
    return 0
  }

  if (number < 0) {
    return number * -1
  }

  return number
}

export function getNumbersDistance(a: number, b: number): number {
  return a > b ? a - b : b - a
}

export function getLimitedNumber(number: number, minimum: number = Number.MIN_SAFE_INTEGER, maximum: number = Number.MAX_SAFE_INTEGER): number {
  if (number >= minimum && number <= maximum) {
    return number
  }

  if (number < minimum) {
    return minimum
  }

  return maximum
}

export function getNumberPercentage(number: number, minimum: number = 0, maximum: number = 100, round: boolean = false): number {
  let percentage: number

  percentage = (number / (maximum - minimum)) * 100
  percentage = round ? Math.round(percentage) : percentage

  return percentage
}

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

export function parseBigInt(value: string | number | bigint | boolean, fallback?: BigInt): BigInt {
  let parsed: BigInt | Error

  parsed = tc(() => BigInt(value))
  if (parsed instanceof Error) return fallback ?? BigInt(0)

  return parsed
}

export function parseNumber(value: any, fallback: number = 0): number {
  let string: string = String(value)

  if (string.includes('.')) {
    return isStringFloat(string) ? parseFloat(string) : fallback
  }

  return isStringInt(string) ? parseInt(string) : fallback
}

export function toFixedNumber(number: number, decimals: number): number {
  return parseNumber(number.toFixed(decimals))
}

export function isNumberEven(number: number): boolean {
  return number % 2 == 0
}

export function isNumberMultipleOf(number: number, of: number): boolean {
  return number % of === 0
}

export function isNumberOdd(number: number): boolean {
  return Math.abs(number % 2) == 1
}
