import { DEFAULT_TYPEAHEAD_DEBOUNCE_TIME } from '../definitions/constants.js'
import { TypeaheadOnMatch, TypeaheadPredicate } from '../definitions/types.js'
import { debounce } from '../functions/debounce.js'
import { ModuleLogger } from '../loggers/module-logger.js'
import { ID } from './id.js'

export class Typeahead<T> {
  private debounceID: string
  debounceTime: number
  value: string

  constructor(onMatch: TypeaheadOnMatch<T>, predicate: TypeaheadPredicate<T>, debounceTime: number = DEFAULT_TYPEAHEAD_DEBOUNCE_TIME) {
    this.debounceID = ID.generate()
    this.debounceTime = debounceTime
    this.predicate = predicate
    this.value = ''

    this.onMatch = onMatch
  }

  onMatch(item: T): any {}

  handle(key: string, items: T[], debounceTime?: number): void {
    let match: T | undefined

    if (key.length !== 1) {
      return
    }

    this.value += key
    ModuleLogger.verbose('Typeahead', 'handle', `The typeahead value has been updated.`, [key, this.value])

    match = items.find((item: T, index: number, items: T[]) => this.predicate(item, this.value, index, items))
    if (match) this.onMatch(match)

    debounce(this.debounceID, () => this.debouncefn(items), debounceTime ?? this.debounceTime)
  }

  predicate(item: T, value: string, index: number, items: T[]) {}

  private debouncefn(items: T[]): void {
    let match: T | undefined

    match = items.find((item: T, index: number, items: T[]) => this.predicate(item, this.value, index, items))
    if (match) this.onMatch(match)

    this.value = ''
    ModuleLogger.verbose('Typeahead', 'handle', `The typeahead value has been reset.`)
  }
}
