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
    expect(getCamelCaseString('camel case')).toBe('camelCase')
    expect(getCamelCaseString('camelCase')).toBe('camelCase')
    expect(getCamelCaseString('camel-case')).toBe('camelCase')
    expect(getCamelCaseString('camel_case')).toBe('camelCase')
    expect(getCamelCaseString('CamelCase')).toBe('camelCase')
  })

  it('makes string kebab case', () => {
    expect(getKebabCaseString('kebab case')).toBe('kebab-case')
    expect(getKebabCaseString('kebabCase')).toBe('kebab-case')
    expect(getKebabCaseString('kebab-case')).toBe('kebab-case')
    expect(getKebabCaseString('kebab_case')).toBe('kebab-case')
    expect(getKebabCaseString('KebabCase')).toBe('kebab-case')
  })

  it('makes string pascal case', () => {
    expect(getPascalCaseString('pascal case')).toBe('PascalCase')
    expect(getPascalCaseString('pascalCase')).toBe('PascalCase')
    expect(getPascalCaseString('pascal-case')).toBe('PascalCase')
    expect(getPascalCaseString('pascal_case')).toBe('PascalCase')
    expect(getPascalCaseString('PascalCase')).toBe('PascalCase')
  })

  it('makes string snake case', () => {
    expect(getSnakeCaseString('snake case')).toBe('snake_case')
    expect(getSnakeCaseString('snakeCase')).toBe('snake_case')
    expect(getSnakeCaseString('snake-case')).toBe('snake_case')
    expect(getSnakeCaseString('snake_case')).toBe('snake_case')
    expect(getSnakeCaseString('SnakeCase')).toBe('snake_case')
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