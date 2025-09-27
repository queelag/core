import { Typeahead } from '../classes/typeahead.js'
import { TYPEAHEAD_MAP } from '../definitions/constants.js'
import type { TypeaheadOptions } from '../definitions/interfaces.js'
import type { TypeaheadMapKey, TypeaheadMapValue } from '../definitions/types.js'
import { FunctionLogger } from '../loggers/function-logger.js'

/**
 * The `typeahead` function is used to search for items in a list, based on user input.
 * When a match is found, the `match` event is emitted.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/typeahead)
 */
export function typeahead<T>(key: TypeaheadMapKey, chunks: string | string[], options?: TypeaheadOptions<T>): Typeahead<T> {
  let instance: TypeaheadMapValue | undefined

  instance = TYPEAHEAD_MAP.get(key)
  instance = instance ?? new Typeahead(key, options?.items, options?.predicate, options?.debounceTime)

  instance.pushChunks(...chunks)
  instance.setDebounceTime(options?.debounceTime)
  instance.setItems(options?.items)
  instance.setListeners(options?.listeners ?? instance.getListeners())
  instance.setPredicate(options?.predicate)

  TYPEAHEAD_MAP.set(key, instance)
  FunctionLogger.verbose('typeahead', key, `The instance has been set.`, instance)

  return instance.search()
}
