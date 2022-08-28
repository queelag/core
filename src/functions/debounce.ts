import { DEBOUNCE_MAP } from '../definitions/constants'
import { DebounceMapKey } from '../definitions/types'
import { FunctionLogger } from '../loggers/function.logger'

/**
 * Lets fn run only if it hasn't be called again for ms time.
 *
 * @returns
 */
export function debounce(fn: Function, ms: number): void
export function debounce(name: string, fn: Function, ms: number): void
export function debounce(...args: any[]): void {
  let key: DebounceMapKey, fn: Function, ms: number

  key = args[0]
  fn = typeof args[0] === 'function' ? args[0] : args[1]
  ms = typeof args[0] === 'function' ? args[1] : args[2]

  clearTimeout(DEBOUNCE_MAP.get(fn) as any)
  FunctionLogger.verbose('Debounce', 'handle', `The timeout has been cleared.`, fn)

  DEBOUNCE_MAP.set(fn, setTimeout(fn, ms))
  FunctionLogger.verbose('Debounce', 'handle', `The timeout has been set.`, fn)
}