import { isObject } from './object-utils.js'

/**
 * Checks if a unknown value is a Promise.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/promise)
 */
export function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise
}

/**
 * Checks if a unknown value is a PromiseLike.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/promise)
 */
export function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
  return isObject<{ then: Function }>(value) && typeof value.then === 'function'
}

/**
 * Checks if a unknown value is not a Promise.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/promise)
 */
export function isNotPromise<T>(value: T | Promise<T>): value is T {
  return !(value instanceof Promise)
}
