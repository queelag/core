import { DEFAULT_EVENT_EMITTER_MAX_LISTENERS } from '../definitions/constants.js'
import { EventEmitterListener, EventEmitterListenerOptions } from '../definitions/interfaces.js'
import { EventEmitterEvents } from '../definitions/types.js'
import { tc } from '../functions/tc.js'
import { removeArrayItems } from '../index.js'
import { ClassLogger } from '../loggers/class-logger.js'

export class EventEmitter<T extends EventEmitterEvents = EventEmitterEvents> {
  private listeners: EventEmitterListener<T, keyof T>[]
  private maxListeners: number

  constructor() {
    this.listeners = []
    this.maxListeners = DEFAULT_EVENT_EMITTER_MAX_LISTENERS
  }

  addListener<K extends keyof T>(name: K, callback: T[K], options?: EventEmitterListenerOptions): this {
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

  countListeners<K extends keyof T>(name?: K, callback?: T[K], options?: EventEmitterListenerOptions): number {
    return this.getListeners(name, callback, options).length
  }

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

  eventNames(): (keyof T)[] {
    return this.listeners.map((listener) => listener.name)
  }

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

  getMaxListeners(): number {
    return this.maxListeners
  }

  off<K extends keyof T>(name?: K, callback?: T[K], options?: EventEmitterListenerOptions): this {
    return this.removeListeners<K>(name, callback, options)
  }

  on<K extends keyof T>(name: K, callback: T[K], options?: EventEmitterListenerOptions): this {
    return this.addListener<K>(name, callback, options)
  }

  once<K extends keyof T>(name: K, callback: T[K], options: EventEmitterListenerOptions = { once: true }): this {
    return this.addListener<K>(name, callback, options)
  }

  prependListener<K extends keyof T>(name: K, callback: T[K], options: EventEmitterListenerOptions = { prepend: true }): this {
    return this.addListener(name, callback, options)
  }

  prependOnceListener<K extends keyof T>(name: K, callback: T[K], options: EventEmitterListenerOptions = { once: true, prepend: true }): this {
    return this.addListener(name, callback, options)
  }

  removeListeners<K extends keyof T>(name?: K, callback?: T[K], options?: EventEmitterListenerOptions): this {
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

  setMaxListeners(n: number): this {
    this.maxListeners = n
    ClassLogger.verbose('EventEmitter', 'setMaxListeners', `The maximum number of listeners has been set to ${n}.`)

    return this
  }
}
