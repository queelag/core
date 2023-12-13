import { tcp } from '../functions/tcp.js'
import { isObject } from './object-utils.js'

export async function chainPromises(...fns: ((...args: any[]) => Promise<any>)[]): Promise<void> {
  for (let fn of fns) {
    await tcp(() => fn())
  }
}

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

export function isPromise<T>(value: any): value is Promise<T> {
  return value instanceof Promise
}

export function isPromiseLike<T>(value: any): value is PromiseLike<T> {
  return isObject<{ then: Function }>(value) && typeof value.then === 'function'
}

export function isNotPromise<T>(value: T | Promise<T>): value is T {
  return !(value instanceof Promise)
}
