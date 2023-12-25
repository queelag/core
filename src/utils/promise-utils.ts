import { tcp } from '../functions/tcp.js'
import { isObject } from './object-utils.js'

/**
 * Executes a list of async functions in sequence.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/promise)
 */
export async function chainPromises(...fns: ((...args: any[]) => Promise<any>)[]): Promise<void> {
  for (let fn of fns) {
    await tcp(() => fn())
  }
}

/**
 * Executes a list of async functions in sequence, the execution stops if a function returns an error or a falsy value.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/promise)
 */
export async function chainTruthyPromises(...fns: ((...args: any[]) => Promise<any>)[]): Promise<boolean> {
  let output: boolean | Error

  for (let fn of fns) {
    output = await tcp(() => fn())
    if (output instanceof Error) return false

    output = Boolean(output)
    if (!output) return false
  }

  return true
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
