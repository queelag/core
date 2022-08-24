import {
  getAbsoluteNumber,
  getHighestNumber,
  getLimitedNumber,
  getLowestNumber,
  getNumberPercentage,
  getNumbersDistance,
  isNumberEven,
  isNumberMultipleOf,
  isNumberOdd,
  parseBigInt,
  parseNumber,
  toFixedNumber
} from '../../src'

describe('NumberUtils', () => {
  it('gets the absolute of a number', () => {
    expect(getAbsoluteNumber(-1)).toBe(1)
    expect(getAbsoluteNumber(-0)).toBe(0)
    expect(getAbsoluteNumber(0)).toBe(0)
    expect(getAbsoluteNumber(1)).toBe(1)
  })

  it('gets the distance between two numbers', () => {
    expect(getNumbersDistance(1, 3)).toBe(2)
    expect(getNumbersDistance(3, 1)).toBe(2)
    expect(getNumbersDistance(1, 1)).toBe(0)
    expect(getNumbersDistance(3, 3)).toBe(0)
  })

  it('limits a number', () => {
    expect(getLimitedNumber(5, 0, 10)).toBe(5)
    expect(getLimitedNumber(5, 4, 10)).toBe(5)
    expect(getLimitedNumber(5, 5, 10)).toBe(5)
    expect(getLimitedNumber(5, 6, 10)).toBe(6)
    expect(getLimitedNumber(5, 0, 6)).toBe(5)
    expect(getLimitedNumber(5, 0, 5)).toBe(5)
    expect(getLimitedNumber(5, 0, 4)).toBe(4)
  })

  it('calculates the percentage', () => {
    expect(getNumberPercentage(50)).toBe(50)
    expect(getNumberPercentage(50, 20)).toBe(62.5)
    expect(getNumberPercentage(50, 50)).toBe(100)
    expect(getNumberPercentage(50, 0, 80)).toBe(62.5)
    expect(getNumberPercentage(50, 0, 50)).toBe(100)
  })

  it('gets highest number', () => {
    expect(getHighestNumber(0, 1, 2)).toBe(2)
    expect(getHighestNumber([0, 1, 2])).toBe(2)
  })

  it('gets lowest number', () => {
    expect(getLowestNumber(0, 1, 2)).toBe(0)
    expect(getLowestNumber([0, 1, 2])).toBe(0)
  })

  it('parses bigint', () => {
    expect(parseBigInt('0')).toBe(0n)
    expect(parseBigInt(0)).toBe(0n)
    expect(parseBigInt(0n)).toBe(0n)
    expect(parseBigInt(false)).toBe(0n)
    expect(parseBigInt(true)).toBe(1n)
  })

  it('parses int and float', () => {
    expect(parseNumber('0')).toBe(0)
    expect(parseNumber('0.1')).toBe(0.1)
  })

  it('gets a number with a fixed amount of decimals', () => {
    expect(toFixedNumber(0.12, 0)).toBe(0)
    expect(toFixedNumber(0.12, 1)).toBe(0.1)
    expect(toFixedNumber(0.12, 2)).toBe(0.12)
    expect(toFixedNumber(0.12, 3)).toBe(0.12)
  })

  it('checks if a number is even', () => {
    expect(isNumberEven(0)).toBeTruthy()
    expect(isNumberEven(1)).toBeFalsy()
    expect(isNumberEven(2)).toBeTruthy()
  })

  it('checks if a number is odd', () => {
    expect(isNumberOdd(0)).toBeFalsy()
    expect(isNumberOdd(1)).toBeTruthy()
    expect(isNumberOdd(2)).toBeFalsy()
  })

  it('checks if a number is a multiple of another', () => {
    expect(isNumberMultipleOf(0, 0)).toBeFalsy()
    expect(isNumberMultipleOf(0, 1)).toBeTruthy()
    expect(isNumberMultipleOf(1, 1)).toBeTruthy()
    expect(isNumberMultipleOf(2, 1)).toBeTruthy()
    expect(isNumberMultipleOf(2, 2)).toBeTruthy()
    expect(isNumberMultipleOf(2, 3)).toBeFalsy()
    expect(isNumberMultipleOf(4, 2)).toBeTruthy()
    expect(isNumberMultipleOf(6, 2)).toBeTruthy()
  })
})
