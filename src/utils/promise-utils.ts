import { tcp } from '../functions/tcp.js'

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
