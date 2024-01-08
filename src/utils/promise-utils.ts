import { cafs } from '../functions/cafs.js'
import { cafsueof } from '../functions/cafsueof.js'
import { isObject } from './object-utils.js'

/**
 * @deprecated
 */
export async function chainPromises(...fns: ((...args: any[]) => Promise<any>)[]): Promise<void> {
  return cafs(...fns)
}

/**
 * @deprecated
 */
export async function chainTruthyPromises(...fns: ((...args: any[]) => Promise<any>)[]): Promise<boolean> {
  return cafsueof(...fns)
}

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
