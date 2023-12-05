import { randomBytes } from 'crypto'
import { describe, expect, it } from 'vitest'
import {
  ALPHABET_NUMBERS,
  GenerateRandomStringRandom,
  generateRandomString,
  getCamelCaseString,
  getCapitalizedString,
  getKebabCaseString,
  getPascalCaseString,
  getSnakeCaseString,
  isStringFloat,
  isStringInt,
  isStringJSON,
  isStringNotJSON,
  isStringNotURL,
  isStringURL
} from '../../src'

describe('String Utils', () => {
  it('capitalizes string', () => {
    expect(getCapitalizedString('hello')).toBe('Hello')
    expect(getCapitalizedString('HELLO', true)).toBe('Hello')
  })

  it('makes string camel case', () => {
    expect(getCamelCaseString('camel case1')).toBe('camelCase1')
    expect(getCamelCaseString('camelCase1')).toBe('camelCase1')
    expect(getCamelCaseString('camel-case1')).toBe('camelCase1')
    expect(getCamelCaseString('camel_case1')).toBe('camelCase1')
    expect(getCamelCaseString('CamelCase1')).toBe('camelCase1')
  })

  it('makes string kebab case', () => {
    expect(getKebabCaseString('kebab case1')).toBe('kebab-case1')
    expect(getKebabCaseString('kebabCase1')).toBe('kebab-case1')
    expect(getKebabCaseString('kebab-case1')).toBe('kebab-case1')
    expect(getKebabCaseString('kebab_case1')).toBe('kebab-case1')
    expect(getKebabCaseString('KebabCase1')).toBe('kebab-case1')
  })

  it('makes string pascal case', () => {
    expect(getPascalCaseString('pascal case1')).toBe('PascalCase1')
    expect(getPascalCaseString('pascalCase1')).toBe('PascalCase1')
    expect(getPascalCaseString('pascal-case1')).toBe('PascalCase1')
    expect(getPascalCaseString('pascal_case1')).toBe('PascalCase1')
    expect(getPascalCaseString('PascalCase1')).toBe('PascalCase1')
  })

  it('makes string snake case', () => {
    expect(getSnakeCaseString('snake case1')).toBe('snake_case1')
    expect(getSnakeCaseString('snakeCase1')).toBe('snake_case1')
    expect(getSnakeCaseString('snake-case1')).toBe('snake_case1')
    expect(getSnakeCaseString('snake_case1')).toBe('snake_case1')
    expect(getSnakeCaseString('SnakeCase1')).toBe('snake_case1')
  })

  it('checks if string is json', () => {
    expect(isStringJSON(JSON.stringify({}))).toBeTruthy()
    expect(isStringJSON('')).toBeFalsy()
    expect(isStringNotJSON(JSON.stringify({}))).toBeFalsy()
    expect(isStringNotJSON('')).toBeTruthy()
  })

  it('checks if string is a float', () => {
    expect(isStringFloat('0.5')).toBeTruthy()
    expect(isStringFloat('0')).toBeTruthy()
    expect(isStringFloat('')).toBeFalsy()
  })

  it('checks if string is an int', () => {
    expect(isStringInt('0')).toBeTruthy()
    expect(isStringInt('0.5')).toBeFalsy()
    expect(isStringInt('')).toBeFalsy()
  })

  it('checks if string is an url', () => {
    expect(isStringURL('https://localhost:3000')).toBeTruthy()
    expect(isStringURL('')).toBeFalsy()
    expect(isStringNotURL('https://localhost:3000')).toBeFalsy()
    expect(isStringNotURL('')).toBeTruthy()
  })

  it('generates random string', () => {
    expect(generateRandomString()).toMatch(/[a-zA-Z0-9]{32}/)
  })

  it('generates random string with a prefix, suffix and custom separator', () => {
    expect(generateRandomString({ prefix: 'prefix' })).toMatch(/prefix_[a-zA-Z0-9]{32}/)
    expect(generateRandomString({ suffix: 'suffix' })).toMatch(/[a-zA-Z0-9]{32}_suffix/)
    expect(generateRandomString({ prefix: 'prefix', suffix: 'suffix' })).toMatch(/prefix_[a-zA-Z0-9]{32}_suffix/)
    expect(generateRandomString({ prefix: 'prefix', separator: '-', suffix: 'suffix' })).toMatch(/prefix-[a-zA-Z0-9]{32}-suffix/)
  })

  it('generates random string with a custom alphabet', () => {
    expect(generateRandomString({ alphabet: ALPHABET_NUMBERS })).toMatch(/[0-9]{32}/)
  })

  it('generates random string with a custom random bytes generator', () => {
    expect(generateRandomString({ random: (bytes: number) => randomBytes(bytes) })).toMatch(/[a-zA-Z0-9]{32}/)
  })

  it('generates random string with a custom size', () => {
    expect(generateRandomString({ size: 16 })).toMatch(/[a-zA-Z0-9]{16}/)
  })

  it('generates random string without collisions', () => {
    let random: GenerateRandomStringRandom, id: string

    random = (bytes: number) => new Uint8Array(bytes).fill(Math.round(Math.random()))
    id = generateRandomString({ random })

    expect(generateRandomString({ blacklist: [id], random })).not.toBe(id)
  })
})
