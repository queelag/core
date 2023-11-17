import { THROTTLE_MAP } from '../definitions/constants.js'
import { FunctionLogger } from '../loggers/function-logger.js'
import { tc } from './tc.js'

export function throttle(fn: Function, ms: number): void
export function throttle(name: string, fn: Function, ms: number): void
export function throttle(...args: any[]): void {
  let key: string, fn: Function, ms: number, previous: number

  key = args[0]
  fn = typeof args[0] === 'function' ? args[0] : args[1]
  ms = typeof args[0] === 'function' ? args[1] : args[2]

  previous = THROTTLE_MAP.get(key) ?? Date.now() - ms
  if (Date.now() - previous < ms)
    return FunctionLogger.verbose('Throttle', 'handle', `The current date minus the stored one is greater than or equal to ms`, [
      Date.now(),
      previous,
      Date.now() - previous,
      ms
    ])

  tc(() => fn())
  FunctionLogger.verbose('Throttle', 'handle', `The ${key} fn has been executed.`)

  THROTTLE_MAP.set(key, Date.now())
  FunctionLogger.verbose('Throttle', 'handle', `The ${key} date has been set.`)
}
