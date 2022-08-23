import { tc } from '../functions/tc'

/**
 * Capitalizes the first letter in a string, if lowercase is set to true the other characters will be lowercased.
 */
export function toCapitalizedString(string: string, lowercase: boolean = false): string {
  return string.charAt(0).toUpperCase() + (lowercase ? string.slice(1).toLowerCase() : string.slice(1))
}

/**
 * Transforms any string to a per word capitalized string but with the first char in lowercase.
 */
export function toCamelCaseString(string: string): string {
  return string
    .split(/[^a-zA-Z]/)
    .map((v: string, k: number) => (k > 0 ? toCapitalizedString(v, true) : v.toLowerCase()))
    .join('')
}

/**
 * Transforms any string to a word divided string by dashes.
 */
export function toKebabCaseString(string: string): string {
  return string.split(/[^a-zA-Z]/).join('-')
}

/**
 * Transforms any string to a word divided string by underscores.
 */
export function toSnakeCaseString(string: string): string {
  return string.split(/[^a-zA-Z]/).join('_')
}

/**
 * Transforms any string to a per word capitalized string.
 */
export function toStartCaseString(string: string): string {
  return string
    .split(/[^a-zA-Z]/)
    .map((v: string) => toCapitalizedString(v, true))
    .join(' ')
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
