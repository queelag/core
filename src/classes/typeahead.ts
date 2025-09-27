import { DEFAULT_TYPEAHEAD_DEBOUNCE_TIME } from '../definitions/constants.js'
import type { TypeaheadEvents } from '../definitions/interfaces.js'
import type { TypeaheadMapKey, TypeaheadPredicate } from '../definitions/types.js'
import { debounce } from '../functions/debounce.js'
import { noop } from '../functions/noop.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { EventEmitter } from './event-emitter.js'

/**
 * The Typeahead class is a state and options holder for the typeahead function.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/typeahead)
 */
export class Typeahead<T> extends EventEmitter<TypeaheadEvents<T>> {
  /**
   * The chunks that make up the query string.
   */
  protected chunks: string[]
  /**
   * The debounce time.
   */
  protected debounceTime: number
  /**
   * The items to search.
   */
  protected items: T[]
  /**
   * The key of the instance.
   */
  protected readonly key: TypeaheadMapKey
  /**
   * The predicate function.
   */
  protected predicate: TypeaheadPredicate<T>

  constructor(key: TypeaheadMapKey, items: T[] = [], predicate: TypeaheadPredicate<T> = noop, debounceTime: number = DEFAULT_TYPEAHEAD_DEBOUNCE_TIME) {
    super()

    this.chunks = []
    this.debounceTime = debounceTime
    this.items = items
    this.key = key
    this.predicate = predicate
  }

  /**
   * The debounce function.
   */
  protected debouncefn = (): void => {
    let match: T | undefined = this.items.find((item: T, index: number, items: T[]) => this.predicate(item, this.getQuery(), index, items))

    if (match) {
      this.emit('match', match)
      ClassLogger.verbose('Typeahead', this.key, `The match event has been emitted.`, [match])
    }

    this.setChunks([])
  }

  /**
   * Searches the items for a match and emits the match event if a match is found.
   */
  search(): this {
    ClassLogger.verbose('typeahead', this.key, `Setting the debounce.`, [this.debounceTime])
    debounce(this.debouncefn, this.debounceTime, this.key)

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
   * Returns the key of the instance.
   */
  getKey(): TypeaheadMapKey {
    return this.key
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
    return this.chunks.join('')
  }

  /**
   * Pushes chunks to the chunks array.
   */
  pushChunks(...chunks: string[]): this {
    this.chunks.push(...chunks)
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
   * Sets the chunks.
   */
  setChunks(chunks: string[] | undefined): this {
    this.chunks = chunks ?? this.chunks
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
