import { DEFAULT_TYPEAHEAD_DEBOUNCE_TIME } from '../definitions/constants.js'
import { TypeaheadEvents } from '../definitions/interfaces.js'
import { TypeaheadPredicate } from '../definitions/types.js'
import { debounce } from '../functions/debounce.js'
import { noop } from '../functions/noop.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { EventEmitter } from './event-emitter.js'

/**
 * The Typeahead class is a state and options holder for the typeahead function.
 */
export class Typeahead<T> extends EventEmitter<TypeaheadEvents<T>> {
  /**
   * The debounce time.
   */
  protected debounceTime: number
  /**
   * The items to search.
   */
  protected items: T[]
  /**
   * The keys that have been pressed.
   */
  protected keys: string[]
  /**
   * The name of the instance.
   */
  protected readonly name: string
  /**
   * The predicate function.
   */
  protected predicate: TypeaheadPredicate<T>

  constructor(name: string, items: T[] = [], predicate: TypeaheadPredicate<T> = noop, debounceTime: number = DEFAULT_TYPEAHEAD_DEBOUNCE_TIME) {
    super()

    this.debounceTime = debounceTime
    this.items = items
    this.keys = []
    this.name = name
    this.predicate = predicate
  }

  /**
   * The debounce function.
   */
  protected debouncefn = (): void => {
    let match: T | undefined = this.items.find((item: T, index: number, items: T[]) => this.predicate(item, this.getQuery(), index, items))

    if (match) {
      this.emit('match', match)
      ClassLogger.verbose('Typeahead', this.name, `The match event has been emitted.`, [match])
    }

    this.setKeys([])
  }

  /**
   * Searches the items for a match and emits the match event if a match is found.
   */
  search(): this {
    let match: T | undefined = this.items.find((item: T, index: number, items: T[]) => this.predicate(item, this.getQuery(), index, items))

    if (match) {
      this.emit('match', match)
      ClassLogger.verbose('Typeahead', this.name, `The match event has been emitted.`, [match])
    }

    ClassLogger.verbose('typeahead', this.name, `Setting the debounce.`, [this.debounceTime])
    debounce(this.name, this.debouncefn, this.debounceTime)

    return this
  }

  /**
   * Returns the debounce time.
   */
  getDebounceTime(): number {
    return this.debounceTime
  }

  /**
   * Returns the items.
   */
  getItems(): T[] {
    return this.items
  }

  /**
   * Returns the name of the instance.
   */
  getName(): string {
    return this.name
  }

  /**
   * Returns the predicate function.
   */
  getPredicate(): TypeaheadPredicate<T> {
    return this.predicate
  }

  /**
   * Returns the query string.
   */
  getQuery(): string {
    return this.keys.join('')
  }

  /**
   * Pushes a key to the keys array.
   */
  pushKey(key: string): this {
    this.keys.push(key)
    return this
  }

  /**
   * Sets the debounce time.
   */
  setDebounceTime(debounceTime: number | undefined): this {
    this.debounceTime = debounceTime ?? this.debounceTime
    return this
  }

  /**
   * Sets the items.
   */
  setItems(items: T[] | undefined): this {
    this.items = items ?? this.items
    return this
  }

  /**
   * Sets the keys.
   */
  setKeys(keys: string[] | undefined): this {
    this.keys = keys ?? this.keys
    return this
  }

  /**
   * Sets the predicate function.
   */
  setPredicate(predicate: TypeaheadPredicate<T> | undefined): this {
    this.predicate = predicate ?? this.predicate
    return this
  }
}
