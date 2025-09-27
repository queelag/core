import { DEFAULT_EVENT_EMITTER_MAX_LISTENERS } from '../definitions/constants.js'
import type { EventEmitterListener, EventEmitterListenerOptions } from '../definitions/interfaces.js'
import type { EventEmitterEvents } from '../definitions/types.js'
import { tc } from '../functions/tc.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { removeArrayItems } from '../utils/array-utils.js'

/**
 * The EventEmitter class is used to emit events and register listeners.
 * The API is based on the Node.js EventEmitter API.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/event-emitter)
 */
export class EventEmitter<T extends EventEmitterEvents = EventEmitterEvents> {
  protected listeners: EventEmitterListener<T, keyof T>[]
  protected maxListeners: number

  constructor() {
    this.listeners = []
    this.maxListeners = DEFAULT_EVENT_EMITTER_MAX_LISTENERS
  }

  /**
   * Counts the listeners that match the name, callback and options.
   * If no arguments are passed, all listeners will be counted.
   */
  countListeners<K extends keyof T>(name?: K, callback?: T[K], options?: EventEmitterListenerOptions): number {
    return this.getListeners(name, callback, options).length
  }

  /**
   * Emits an event.
   */
  emit<K extends keyof T>(name: K, ...args: Parameters<T[K]>): boolean {
    let listeners: EventEmitterListener<T, keyof T>[]

    listeners = this.listeners.filter((listener: EventEmitterListener<T, keyof T>) => listener.name === name)
    ClassLogger.verbose('EventEmitter', 'emit', `The listeners have been filtered.`, [name], listeners)

    for (let listener of listeners) {
      tc(() => listener.callback(...args))
      ClassLogger.verbose('EventEmitter', 'emit', `The listener has been called.`, listener, args)

      if (listener.options?.once) {
        this.listeners = this.listeners.filter((l: EventEmitterListener<T, keyof T>) => l !== listener)
        ClassLogger.verbose('EventEmitter', 'emit', `The listener has been removed.`, listener)
      }
    }

    return true
  }

  /**
   * Returns the names of the events that have listeners.
   */
  getEventNames(): (keyof T)[] {
    return this.listeners.map((listener) => listener.name)
  }

  /**
   * Returns the listeners that match the name, callback and options.
   * If no arguments are passed, all listeners will be returned.
   */
  getListeners<K extends keyof T>(name?: K, callback?: T[K], options?: EventEmitterListenerOptions): EventEmitterListener<T, keyof T>[] {
    return this.listeners.filter((listener: EventEmitterListener<T, keyof T>) =>
      [
        typeof name === 'string' ? listener.name === name : true,
        typeof callback === 'function' ? listener.callback === callback : true,
        typeof options?.once === 'boolean' ? Boolean(listener.options?.once) === options.once : true,
        typeof options?.prepend === 'boolean' ? Boolean(listener.options?.prepend) === options.prepend : true
      ].every(Boolean)
    )
  }

  /**
   * Returns the maximum number of listeners that can be registered for a single event.
   */
  getMaxListeners(): number {
    return this.maxListeners
  }

  /**
   * Checks if the event has listeners that match the name, callback and options.
   */
  hasListeners<K extends keyof T>(name?: K, callback?: T[K], options?: EventEmitterListenerOptions): boolean {
    return this.countListeners(name, callback, options) > 0
  }

  /**
   * Removes the listeners that match the name, callback and options.
   * If no arguments are passed, all listeners will be removed.
   */
  off<K extends keyof T>(name?: K, callback?: T[K], options?: EventEmitterListenerOptions): this {
    this.listeners = removeArrayItems(this.listeners, (_, listener: EventEmitterListener<T, keyof T>) =>
      [
        typeof name === 'string' ? listener.name === name : true,
        typeof callback === 'function' ? listener.callback === callback : true,
        typeof options?.once === 'boolean' ? Boolean(listener.options?.once) === options.once : true,
        typeof options?.prepend === 'boolean' ? Boolean(listener.options?.prepend) === options.prepend : true
      ].every(Boolean)
    )
    ClassLogger.verbose('EventEmitter', 'removeListener', `The matching listeners have been removed.`, [name, callback, options])

    return this
  }

  /**
   * Adds a listener, which will be called when the event is emitted.
   *
   * Optionally the listener can be removed after the first call with the `once` option.
   * Optionally the listener can be prepended to the listeners array with the `prepend` option.
   */
  on<K extends keyof T>(name: K, callback: T[K], options?: EventEmitterListenerOptions): this {
    let count: number, listener: EventEmitterListener<T, K>

    count = this.countListeners(name, callback, options)
    listener = { callback, name, options }

    if (count >= this.maxListeners) {
      ClassLogger.warn('EventEmitter', 'addListener', `The maximum number of listeners has been reached.`, listener, [count, this.maxListeners])
      return this
    }

    if (options?.prepend) {
      this.listeners.unshift(listener)
      ClassLogger.verbose('EventEmitter', 'addListener', `The listener has been unshifted.`, listener)

      return this
    }

    this.listeners.push(listener)
    ClassLogger.verbose('EventEmitter', 'addListener', `The listener has been pushed.`, listener)

    return this
  }

  /**
   * Adds a listener, which will be called only once when the event is emitted.
   */
  once<K extends keyof T>(name: K, callback: T[K], options?: EventEmitterListenerOptions): this {
    return this.on<K>(name, callback, { ...options, once: true })
  }

  /**
   * Adds a listener, which will be called first when the event is emitted.
   */
  prepend<K extends keyof T>(name: K, callback: T[K], options?: EventEmitterListenerOptions): this {
    return this.on<K>(name, callback, { ...options, prepend: true })
  }

  /**
   * Sets the listeners.
   */
  setListeners(listeners: EventEmitterListener<T, keyof T>[]): this {
    this.listeners = listeners
    ClassLogger.verbose('EventEmitter', 'setListeners', `The listeners have been set.`, listeners)

    return this
  }

  /**
   * Sets the maximum number of listeners that can be registered for a single event.
   */
  setMaxListeners(n: number): this {
    this.maxListeners = n
    ClassLogger.verbose('EventEmitter', 'setMaxListeners', `The maximum number of listeners has been set to ${n}.`)

    return this
  }
}
