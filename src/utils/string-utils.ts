import { customRandom } from 'nanoid'
import {
  DEFAULT_GENERATE_RANDOM_STRING_ALPHABET,
  DEFAULT_GENERATE_RANDOM_STRING_RANDOM,
  DEFAULT_GENERATE_RANDOM_STRING_SEPARATOR,
  DEFAULT_GENERATE_RANDOM_STRING_SIZE,
  REGEXP_NOT_LETTERS_AND_NUMBERS,
  REGEXP_NOT_LOWERCASE_LETTERS_AND_NUMBERS,
  REGEXP_UPPERCASE_LETTERS
} from '../definitions/constants.js'
import { GenerateRandomStringOptions } from '../definitions/interfaces.js'
import { tc } from '../functions/tc.js'

export function generateRandomString(options?: GenerateRandomStringOptions): string {
  let alphabet: string, blacklist: string[], random: (bytes: number) => Uint8Array, separator: string, size: number, id: string

  alphabet = options?.alphabet ?? DEFAULT_GENERATE_RANDOM_STRING_ALPHABET
  blacklist = options?.blacklist ?? []
  random = options?.random ?? DEFAULT_GENERATE_RANDOM_STRING_RANDOM
  separator = options?.separator ?? DEFAULT_GENERATE_RANDOM_STRING_SEPARATOR
  size = options?.size ?? DEFAULT_GENERATE_RANDOM_STRING_SIZE

  while (true) {
    id = [options?.prefix, customRandom(alphabet, size, random)(), options?.suffix].filter(Boolean).join(separator)
    if (!blacklist.includes(id)) break
  }

  return id
}

export function getCamelCaseString(string: string): string {
  let camel: string, ucnlcl: boolean

  camel = ''
  ucnlcl = false

  for (let i = 0; i < string.length; i++) {
    if (REGEXP_UPPERCASE_LETTERS.test(string[i])) {
      camel += i <= 0 ? string[i].toLowerCase() : string[i]
      continue
    }

    if (REGEXP_NOT_LOWERCASE_LETTERS_AND_NUMBERS.test(string[i])) {
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

export function getCapitalizedString(string: string, lowercase: boolean = false): string {
  return string.charAt(0).toUpperCase() + (lowercase ? string.slice(1).toLowerCase() : string.slice(1))
}

export function getKebabCaseString(string: string): string {
  return getSymbolCaseString(string, '-')
}

export function getPascalCaseString(string: string): string {
  let start: string, ucnl: boolean

  start = ''
  ucnl = false

  for (let char of string) {
    if (REGEXP_NOT_LETTERS_AND_NUMBERS.test(char)) {
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

export function getSnakeCaseString(string: string): string {
  return getSymbolCaseString(string, '_')
}

export function getSymbolCaseString(string: string, symbol: string): string {
  let result: string = ''

  for (let i = 0; i < string.length; i++) {
    if (REGEXP_UPPERCASE_LETTERS.test(string[i])) {
      result += (i <= 0 ? '' : symbol) + string[i].toLowerCase()
      continue
    }

    if (REGEXP_NOT_LOWERCASE_LETTERS_AND_NUMBERS.test(string[i])) {
      result += symbol
      continue
    }

    result += string[i]
  }

  return result
}

export function isStringFloat(string: string): boolean {
  return !isNaN(parseFloat(string))
}

export function isStringInt(string: string): boolean {
  if (string.includes('.')) {
    return false
  }

  return !isNaN(parseInt(string))
}

export function isStringJSON(string: string): boolean {
  return !(tc(() => JSON.parse(string), false) instanceof Error)
}

export function isStringNotJSON(string: string): boolean {
  return !isStringJSON(string)
}

export function isStringURL(string: string): boolean {
  let url: URL | TypeError

  url = tc(() => new URL(string), false)
  if (!(url instanceof URL)) return false

  return true
}

export function isStringNotURL(string: string): boolean {
  return !isStringURL(string)
}
