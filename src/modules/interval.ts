import { Logger } from './logger'
import { tc } from './tc'

export class Interval {
  static data: Map<string, number> = new Map()

  static start<T extends string>(name: T, fn: () => any, ms: number): void {
    window.clearInterval(this.data.get(name))
    Logger.debug('Interval', 'start', `The interval with name ${name} has been cleared.`)

    tc(() => fn())
    Logger.debug('Interval', 'start', `The interval with name ${name} has been executed.`)

    this.data.set(name, window.setInterval(fn, ms))
    Logger.debug('Interval', 'start', `The interval with name ${name} has been set.`)
  }

  static stop<T extends string>(name: T): void {
    let potential: number | undefined

    potential = this.data.get(name)
    if (!potential) return Logger.warn('Interval', 'stop', `No interval with name ${name} has been set.`)

    window.clearInterval(potential)
    Logger.debug('Interval', 'stop', `The interval with name ${name} has been cleared.`)

    this.data.delete(name)
  }

  static isRunning<T extends string>(name: T): boolean {
    return this.data.has(name)
  }
}
