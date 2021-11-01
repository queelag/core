import { HistoryDataValue } from '../definitions/interfaces'
import { ObjectUtils } from '../utils/object.utils'
import { Logger } from './logger'

class _ {
  data: Map<string, HistoryDataValue<any>>

  constructor() {
    this.data = new Map()
  }

  track<T>(name: string, store: T, path: keyof T, size: number = 100): void {
    let value: HistoryDataValue<T>

    value = this.data.get(name) || this.dummy

    value.index = 0
    value.path = path
    value.size = size
    value.store = store
    value.versions = [ObjectUtils.clone(value.store[value.path] as any)]

    this.set(name, value)
  }

  redo<T>(name: string): void {
    if (this.isNotRedoable(name)) {
      return Logger.warn('History', 'redo', `The value with name ${name} is not redoable.`)
    }

    this.setIndex<T>(name, 1)
  }

  undo<T>(name: string): void {
    if (this.isNotUndoable(name)) {
      return Logger.warn('History', 'undo', `The value with name ${name} is not undoable.`)
    }

    this.setIndex<T>(name, -1)
  }

  push<T>(name: string): void {
    let value: HistoryDataValue<T> | undefined

    value = this.data.get(name)
    if (!value) return Logger.warn('History', 'push', `The value with name ${name} does not exist.`)

    if (this.isRedoable(name)) {
      value.versions = []
      Logger.debug('History', 'push', `The value versions have been reset.`)
    }

    value.versions = [...value.versions, ObjectUtils.clone(value.store[value.path] as any)].slice(0, value.size)
    value.index = value.versions.length - 1

    this.set(name, value)
  }

  private set<T>(name: string, value: HistoryDataValue<T>): void {
    this.data.set(name, value)
    Logger.debug('History', 'set', `The value with name ${name} has been set.`, value)
  }

  private setIndex<T>(name: string, offset: number): void {
    let value: HistoryDataValue<T> | undefined

    value = this.data.get(name)
    if (!value) return Logger.warn('History', 'redo', `The value with name ${name} does not exist.`)

    value.index = value.index + offset
    value.store[value.path] = ObjectUtils.clone(value.versions[value.index])

    this.set(name, value)
  }

  isRedoable<T>(name: string): boolean {
    let value: HistoryDataValue<T> | undefined

    value = this.data.get(name)
    if (!value) return false

    return value.index < value.versions.length - 1
  }

  isNotRedoable<T>(name: string): boolean {
    return this.isRedoable<T>(name) === false
  }

  isUndoable<T>(name: string): boolean {
    let value: HistoryDataValue<T> | undefined

    value = this.data.get(name)
    if (!value) return false

    return value.index > 0 && value.versions.length > 1
  }

  isNotUndoable<T>(name: string): boolean {
    return this.isUndoable<T>(name) === false
  }

  private get dummy(): HistoryDataValue<any> {
    return {
      index: 0,
      path: '',
      size: 0,
      store: {},
      versions: []
    }
  }
}

/**
 * A module to handle history changes.
 *
 * Usage:
 *
 * ```typescript
 * import { History } from '@queelag/core'
 *
 * const store = {
 *   data: 0
 * }
 *
 * History.track('store', store, 'data')
 *
 * store.data++
 * History.push('store')
 *
 * // This will return 1
 * console.log(store.data)
 *
 * History.undo('store')
 *
 * // This will return 0
 * console.log(store.data)
 *
 * History.redo('store')
 *
 * // This will return 1
 * console.log(store.data)
 * ```
 *
 * @category Module
 */
export const History = new _()
