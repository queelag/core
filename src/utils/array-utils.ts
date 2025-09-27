import { DEFAULT_HAS_ARRAY_ITEM_PREDICATE, DEFAULT_REMOVE_ARRAY_ITEMS_PREDICATE } from '../definitions/constants.js'
import type { HasArrayItemPredicate, RemoveArrayItemsPredicate } from '../definitions/types.js'

/**
 * Creates a copy of an array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/array)
 */
export function cloneArray<T>(array: T[]): T[] {
  return [...array]
}

/**
 * Returns the symmetric difference between two or more arrays.
 * Optionally you can pass a custom function to check if an item is included in the result array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/array)
 */
export function getArraysDifference<T>(arrays: T[][], predicate: HasArrayItemPredicate<T> = DEFAULT_HAS_ARRAY_ITEM_PREDICATE): T[] {
  let result: T[] = []

  for (let array of arrays) {
    for (let item of array) {
      let pushed: boolean, included: boolean

      pushed = predicate(result, item)
      if (pushed) continue

      included = arrays.some((array_: T[]) => array_ !== array && predicate(array_, item))
      if (included) continue

      result.push(item)
    }
  }

  return result
}

/**
 * Returns the intersection between two or more arrays.
 * Optionally you can pass a custom function to check if an item is included in the result array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/array)
 */
export function getArraysIntersection<T>(arrays: T[][], predicate: HasArrayItemPredicate<T> = DEFAULT_HAS_ARRAY_ITEM_PREDICATE): T[] {
  let result: T[] = []

  for (let array of arrays) {
    for (let item of array) {
      let pushed: boolean, intersects: boolean

      pushed = predicate(result, item)
      if (pushed) continue

      intersects = arrays.every((array: T[]) => predicate(array, item))
      if (!intersects) continue

      result.push(item)
    }
  }

  return result
}

/**
 * Returns the last item of an array.
 * Optionally you can pass a fallback value that will be returned if the array is empty.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/array)
 */
export function getArrayLastItem<T>(array: T[]): T | undefined
export function getArrayLastItem<T>(array: T[], fallback: T): T
export function getArrayLastItem<T>(array: T[], fallback?: T): T | undefined {
  return array[array.length - 1] ?? fallback
}

/**
 * Removes all duplicates from an array.
 * Optionally you can pass a custom function to check if an item is included in the result array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/array)
 */
export function removeArrayDuplicates<T>(array: T[], predicate: HasArrayItemPredicate<T> = DEFAULT_HAS_ARRAY_ITEM_PREDICATE): T[] {
  let result: T[] = []

  if (predicate === DEFAULT_HAS_ARRAY_ITEM_PREDICATE) {
    return [...new Set(array)]
  }

  for (let item of array) {
    let duplicate: boolean

    duplicate = predicate(result, item)
    if (duplicate) continue

    result.push(item)
  }

  return result
}

/**
 * Removes items from an array that match the predicate or are in the items array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/array)
 */
export function removeArrayItems<T>(array: T[], predicate: RemoveArrayItemsPredicate<T>): T[]
export function removeArrayItems<T>(array: T[], items: T[]): T[]
export function removeArrayItems<T>(array: T[], ...args: any[]): T[] {
  let items: T[] | undefined,
    predicate: RemoveArrayItemsPredicate<T>,
    result: T[] = []

  items = typeof args[0] === 'object' ? args[0] : undefined
  predicate = typeof args[0] === 'function' ? args[0] : DEFAULT_REMOVE_ARRAY_ITEMS_PREDICATE

  for (let item of array) {
    let removed: boolean

    removed = predicate(result, item, items)
    if (removed) continue

    result.push(item)
  }

  return result
}

/**
 * Checks if the given value is an array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/array)
 */
export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value)
}
