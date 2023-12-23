import { DEBOUNCE_MAP } from '../definitions/constants.js'
import { DebounceMapKey } from '../definitions/types.js'
import { FunctionLogger } from '../loggers/function-logger.js'

/**
 * The `debounce` function is used to prevent a function from being called too many times in a short period.
 * The function will only be called after it stops being called for the specified amount of time.
 *
 * Optionally you can specify the key to use, otherwise the function itself will be used as the key.
 */
export function debounce(fn: Function, ms: number, key: DebounceMapKey = fn): void {
  clearTimeout(DEBOUNCE_MAP.get(key))
  FunctionLogger.verbose('debounce', key, `The timeout has been cleared.`)

  DEBOUNCE_MAP.set(key, setTimeout(fn, ms))
  FunctionLogger.verbose('debounce', key, `The timeout has been set.`, [ms])
}
