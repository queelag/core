import { REGEXP_NOT_LETTERS, REGEXP_NOT_LOWERCASE_LETTERS, REGEXP_UPPERCASE_LETTERS } from '../definitions/constants.js'
import { tc } from '../functions/tc.js'

/**
 * Capitalizes the first letter in a string, if lowercase is set to true the other characters will be lowercased.
 */
export function getCapitalizedString(string: string, lowercase: boolean = false): string {
  return string.charAt(0).toUpperCase() + (lowercase ? string.slice(1).toLowerCase() : string.slice(1))
}

/**
 * Transforms any string to a per word capitalized string but with the first char in lowercase.
 */
export function getCamelCaseString(string: string): string {
  let camel: string, ucnlcl: boolean

  camel = ''
  ucnlcl = false

  for (let i = 0; i < string.length; i++) {
    if (REGEXP_UPPERCASE_LETTERS.test(string[i])) {
      camel += i <= 0 ? string[i].toLowerCase() : string[i]
      continue
    }

    if (REGEXP_NOT_LOWERCASE_LETTERS.test(string[i])) {
      ucnlcl = true
      continue
    }

    if (ucnlcl) {
      camel += string[i].toUpperCase()
      ucnlcl = false

      continue
    }

    camel += string[i]
  }

  return camel
}

function getSymbolSeparatedCaseString(string: string, symbol: string): string {
  let result: string = ''

  for (let i = 0; i < string.length; i++) {
    if (REGEXP_UPPERCASE_LETTERS.test(string[i])) {
      result += (i <= 0 ? '' : symbol) + string[i].toLowerCase()
      continue
    }

    if (REGEXP_NOT_LOWERCASE_LETTERS.test(string[i])) {
      result += symbol
      continue
    }

    result += string[i]
  }

  return result
}

/**
 * Transforms any string to a word divided string by dashes.
 */
export function getKebabCaseString(string: string): string {
  return getSymbolSeparatedCaseString(string, '-')
}

/**
 * Transforms any string to a per word capitalized string.
 */
export function getPascalCaseString(string: string): string {
  let start: string, ucnl: boolean

  start = ''
  ucnl = false

  for (let char of string) {
    if (REGEXP_NOT_LETTERS.test(char)) {
      ucnl = true
      continue
    }

    if (ucnl) {
      start += char.toUpperCase()
      ucnl = false

      continue
    }

    start += char
  }

  return getCapitalizedString(start)
}

/**
 * Transforms any string to a word divided string by underscores.
 */
export function getSnakeCaseString(string: string): string {
  return getSymbolSeparatedCaseString(string, '_')
}

/**
 * Checks if a string is a stringified JSON.
 */
export function isStringJSON(string: string): boolean {
  return !(tc(() => JSON.parse(string), false) instanceof Error)
}

/**
 * Checks if a string is not a stringified JSON.
 */
export function isStringNotJSON(string: string): boolean {
  return !isStringJSON(string)
}

/**
 * Checks if a string is a float.
 */
export function isStringFloat(string: string): boolean {
  return !isNaN(parseFloat(string))
}

/**
 * Checks if a string is an int.
 */
export function isStringInt(string: string): boolean {
  if (string.includes('.')) {
    return false
  }

  return !isNaN(parseInt(string))
}

/**
 * Checks if a string is a valid URL.
 */
export function isStringURL(string: string): boolean {
  let url: URL | TypeError

  url = tc(() => new URL(string), false)
  if (!(url instanceof URL)) return false

  return true
}

/**
 * Checks if a string is not a valid URL.
 */
export function isStringNotURL(string: string): boolean {
  return !isStringURL(string)
}
