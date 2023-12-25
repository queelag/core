import { tcp } from './tcp.js'

/**
 * The `cafsueof` function stands for `call async functions sequentially until error or falsy`. It executes a list of async functions in sequence, the execution stops if a function throws or returns an error or a falsy value.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/cafsueof)
 */
export async function cafsueof(...fns: ((...args: any[]) => Promise<any>)[]): Promise<boolean> {
  let output: boolean | Error

  for (let fn of fns) {
    output = await tcp(() => fn())
    if (output instanceof Error) return false

    output = Boolean(output)
    if (!output) return false
  }

  return true
}
