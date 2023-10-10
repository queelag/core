import { describe, expect, it } from 'vitest'
import {
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

describe('StringUtils', () => {
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
})
