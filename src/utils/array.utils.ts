import { DEFAULT_ARRAY_INCLUDES, DEFAULT_ARRAY_REMOVES } from '../definitions/constants'
import { ArrayIncludes, ArrayRemoves } from '../definitions/types'

/**
 * Returns the symmetric difference between the T arrays.
 */
export function getArraysDifference<T>(arrays: T[][], includes: ArrayIncludes<T> = DEFAULT_ARRAY_INCLUDES): T[] {
  let result: T[] = []

  for (let array of arrays) {
    for (let item of array) {
      let pushed: boolean, included: boolean

      pushed = includes(result, item)
      if (pushed) continue

      included = arrays.some((array_: T[]) => array_ !== array && includes(array_, item))
      if (included) continue

      result.push(item)
    }
  }

  return result
}

/**
 * Returns the intersection between the T arrays.
 */
export function getArraysIntersection<T>(arrays: T[][], includes: ArrayIncludes<T> = DEFAULT_ARRAY_INCLUDES): T[] {
  let result: T[] = []

  for (let array of arrays) {
    for (let item of array) {
      let pushed: boolean, intersects: boolean

      pushed = includes(result, item)
      if (pushed) continue

      intersects = arrays.every((array: T[]) => includes(array, item))
      if (!intersects) continue

      result.push(item)
    }
  }

  return result
}

/**
 * Gets the last T item, falls back to fallback if defined and if not returns undefined.
 */
export function getArrayLastItem<T>(array: T[]): T | undefined
export function getArrayLastItem<T>(array: T[], fallback: T): T
export function getArrayLastItem<T>(array: T[], fallback?: T): T | undefined {
  return array[array.length - 1] || fallback
}

/**
 * Removes every duplicate using Set if no callbackfn is defined.
 */
export function removeArrayDuplicates<T>(array: T[], includes: ArrayIncludes<T> = DEFAULT_ARRAY_INCLUDES): T[] {
  let result: T[] = []

  if (includes === DEFAULT_ARRAY_INCLUDES) {
    return [...new Set(array)]
  }

  for (let item of array) {
    let duplicate: boolean

    duplicate = includes(result, item)
    if (duplicate) continue

    result.push(item)
  }

  return result
}

/**
 * Removes every T item matching the callbackfn result.
 */
export function removeArrayItems<T>(array: T[], removes?: ArrayRemoves<T>): T[]
export function removeArrayItems<T>(array: T[], items: T[], removes?: ArrayRemoves<T>): T[]
export function removeArrayItems<T>(...args: any[]): T[] {
  let array: T[], items: T[] | undefined, removes: ArrayRemoves<T>, result: T[]

  array = args[0]
  items = typeof args[1] === 'function' ? undefined : args[1]

  removes = typeof args[1] === 'function' ? args[1] : args[2]
  removes = removes || DEFAULT_ARRAY_REMOVES

  result = []

  for (let item of array) {
    let removed: boolean

    removed = removes(items || result, item)
    if (removed) continue

    result.push(item)
  }

  return result
}

/**
 * Checks whether value is an array.
 */
export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value)
}
