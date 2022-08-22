import { tcp } from '@/functions/tcp'

/**
 * Calls every fn synchronously.
 */
export async function chainPromises(...fns: ((...args: any[]) => Promise<any>)[]): Promise<void> {
  for (let i = 0; i < fns.length; i++) {
    await tcp(() => fns[i]())
  }
}

/**
 * Calls every fn synchronously and keeps running only if the return value is truthy and not an instance of Error.
 */
export async function chainTruthyPromises(...fns: ((...args: any[]) => Promise<any>)[]): Promise<boolean> {
  let output: boolean | Error

  for (let i = 0; i < fns.length; i++) {
    output = await tcp(() => fns[i]())
    if (output instanceof Error) return false

    output = Boolean(output)
    if (!output) return false
  }

  return true
}
