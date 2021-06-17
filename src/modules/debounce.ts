import { Logger } from './logger'

export class Debounce {
  static data: Map<string, number> = new Map()

  static handle<T extends string>(name: T, fn: () => any, ms: number): void {
    window.clearTimeout(this.data.get(name))
    Logger.debug('Debounce', 'handle', `The timeout with name ${name} has been cleared.`)

    this.data.set(name, window.setTimeout(fn, ms))
    Logger.debug('Debounce', 'handle', `The timeout with name ${name} has been memorized.`)
  }
}
