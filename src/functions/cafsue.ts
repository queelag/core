import { tcp } from './tcp.js'

/**
 * The `cafsue` function stands for `call async functions sequentially until error`. It executes a list of async functions in sequence, the execution stops if a function throws or returns an error.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/cafsue)
 */
export async function cafsue(...fns: ((...args: any[]) => Promise<any>)[]): Promise<void> {
  let output: unknown | Error

  for (let fn of fns) {
    output = await tcp(() => fn())
    if (output instanceof Error) return
  }
}
