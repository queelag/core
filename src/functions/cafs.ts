import { tcp } from './tcp.js'

/**
 * The `cafs` function stands for `call async functions sequentially`. It executes a list of async functions in sequence.
 */
export async function cafs(...fns: ((...args: any[]) => Promise<any>)[]): Promise<void> {
  for (let fn of fns) {
    await tcp(() => fn())
  }
}
