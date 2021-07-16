import { tcp } from '../modules/tcp'

/**
 * Utils for anything related to promises.
 *
 * @category Utility
 */
class PromiseUtils {
  /** @hidden */
  constructor() {}

  /**
   * Calls every function of fns synchronously
   */
  static async chain(...fns: ((...args: any) => Promise<any>)[]): Promise<void> {
    for (let i = 0; i < fns.length; i++) {
      await tcp(() => fns[i]())
    }
  }

  /**
   * Calls every function of fns synchronously and keeps running only if the return value is truthy
   */
  static async truthyChain(...fns: ((...args: any) => Promise<any>)[]): Promise<boolean> {
    let output: boolean | Error

    for (let i = 0; i < fns.length; i++) {
      output = await tcp(() => fns[i]())
      if (output instanceof Error) return false

      output = Boolean(output)
      if (!output) return false
    }

    return true
  }
}

export { PromiseUtils }
