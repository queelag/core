import { Logger } from './logger'

export class Timeout {
  static data: Map<string, NodeJS.Timeout | number> = new Map()

  static start<T extends string>(name: T, fn: () => any, ms: number): void {
    this.data.set(name, setTimeout(fn, ms))
    Logger.debug('Timeout', 'start', `The timeout with name ${name} has been set.`)
  }

  static stop<T extends string>(name: T): void {
    let potential: NodeJS.Timeout | number | undefined

    potential = this.data.get(name)
    if (!potential) return Logger.error('Timeout', 'stop', `No timeout with name ${name} has been set.`)

    clearTimeout(potential as any)
    Logger.debug('Timeout', 'stop', `The timeout with name ${name} has been cleared.`)
  }
}
