import {
  isStringFloat,
  isStringInt,
  isStringJSON,
  isStringNotJSON,
  toCamelCaseString,
  toCapitalizedString,
  toKebabCaseString,
  toSnakeCaseString,
  toStartCaseString
} from '../../src'

describe('StringUtils', () => {
  it('capitalizes string', () => {
    expect(toCapitalizedString('hello')).toBe('Hello')
    expect(toCapitalizedString('HELLO', true)).toBe('Hello')
  })

  it('makes string camel case', () => {
    expect(toCamelCaseString('camel case')).toBe('camelCase')
    expect(toCamelCaseString('camelCase')).toBe('camelCase')
    expect(toCamelCaseString('camel-case')).toBe('camelCase')
    expect(toCamelCaseString('camel_case')).toBe('camelCase')
    expect(toCamelCaseString('CamelCase')).toBe('camelCase')
  })

  it('makes string kebab case', () => {
    expect(toKebabCaseString('kebab case')).toBe('kebab-case')
    expect(toKebabCaseString('kebabCase')).toBe('kebab-case')
    expect(toKebabCaseString('kebab-case')).toBe('kebab-case')
    expect(toKebabCaseString('kebab_case')).toBe('kebab-case')
    expect(toKebabCaseString('KebabCase')).toBe('kebab-case')
  })

  it('makes string snake case', () => {
    expect(toSnakeCaseString('snake case')).toBe('snake_case')
    expect(toSnakeCaseString('snakeCase')).toBe('snake_case')
    expect(toSnakeCaseString('snake-case')).toBe('snake_case')
    expect(toSnakeCaseString('snake_case')).toBe('snake_case')
    expect(toSnakeCaseString('SnakeCase')).toBe('snake_case')
  })

  it('makes string start case', () => {
    expect(toStartCaseString('start case')).toBe('StartCase')
    expect(toStartCaseString('startCase')).toBe('StartCase')
    expect(toStartCaseString('start-case')).toBe('StartCase')
    expect(toStartCaseString('start_case')).toBe('StartCase')
    expect(toStartCaseString('StartCase')).toBe('StartCase')
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
})
