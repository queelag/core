import { Typeahead } from '../classes/typeahead.js'
import { TYPEAHEAD_MAP } from '../definitions/constants.js'
import { TypeaheadOptions } from '../definitions/interfaces.js'
import { TypeaheadMapValue } from '../definitions/types.js'
import { FunctionLogger } from '../loggers/function-logger.js'

export function typeahead<T>(name: string, key: string, options?: TypeaheadOptions<T>): Typeahead<T> {
  let instance: TypeaheadMapValue | undefined

  instance = TYPEAHEAD_MAP.get(name)
  instance = instance ?? new Typeahead(name, options?.items, options?.predicate, options?.debounceTime)

  instance.pushKey(key)
  instance.setDebounceTime(options?.debounceTime ?? instance.getDebounceTime())
  instance.setItems(options?.items ?? instance.getItems())
  instance.setListeners(options?.listeners ?? instance.getListeners())
  instance.setPredicate(options?.predicate ?? instance.getPredicate())

  TYPEAHEAD_MAP.set(name, instance)
  FunctionLogger.verbose('typeahead', name, `The instance has been set.`, instance)

  if (options?.search !== false) {
    FunctionLogger.verbose('typeahead', name, `Calling the search function.`)
    instance.search()
  }

  return instance
}