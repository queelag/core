import {
  REGEXP_URL_AMPERSANDS_AFTER_QUESTION_MARKS,
  REGEXP_URL_ENDING_WITH_QUESTION_MARK,
  REGEXP_URL_MULTIPLE_AMPERSANDS,
  REGEXP_URL_MULTIPLE_QUESTION_MARKS,
  REGEXP_URL_MULTIPLE_SLASHES,
  REGEXP_URL_QUESTION_MARKS_AFTER_AMPERSANDS
} from '../definitions/constants.js'

/**
 * Joins a set of URL chunks without making syntax errors.
 */
export function concatURL(...chunks: Partial<string>[]): string {
  return chunks
    .filter(Boolean)
    .map((v: string) => v.trim())
    .join('/')
    .replace(REGEXP_URL_MULTIPLE_SLASHES, (substring: string) => (substring.includes(':') ? substring : '/'))
    .trim()
}

/**
 * Joins a set of search params and safely appends them to the url.
 */
export function appendSearchParamsToURL(url: string, parameters: string): string {
  return [url.trim(), parameters.trim()]
    .join(url.includes('=') ? '&' : '?')
    .replace(REGEXP_URL_ENDING_WITH_QUESTION_MARK, '')
    .replace(REGEXP_URL_MULTIPLE_AMPERSANDS, '&')
    .replace(REGEXP_URL_MULTIPLE_QUESTION_MARKS, '?')
    .replace(REGEXP_URL_AMPERSANDS_AFTER_QUESTION_MARKS, '?')
    .replace(REGEXP_URL_QUESTION_MARKS_AFTER_AMPERSANDS, '&')
}

/**
 * Removes every search param in a URL.
 */
export function removeSearchParamsFromURL(url: string): string {
  return url.slice(0, url.includes('?') ? url.indexOf('?') : undefined)
}
