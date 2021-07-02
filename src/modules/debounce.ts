import { Logger } from './logger'

export class Debounce {
  static data: Map<string, NodeJS.Timeout | number> = new Map()

  static handle<T extends string>(name: T, fn: () => any, ms: number): void {
    clearTimeout(this.data.get(name) as any)
    Logger.debug('Debounce', 'handle', `The timeout with name ${name} has been cleared.`)

    this.data.set(name, setTimeout(fn, ms))
    Logger.debug('Debounce', 'handle', `The timeout with name ${name} has been memorized.`)
  }
}
