import { tcp } from './tcp.js'

/**
 * The `cafs` function stands for `call async functions sequentially`. It executes a list of async functions in sequence.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/cafs)
 */
export async function cafs(...fns: ((...args: any[]) => Promise<any>)[]): Promise<void> {
  for (let fn of fns) {
    // biome-ignore lint/performance/noAwaitInLoops: intended usage
    await tcp(() => fn())
  }
}
