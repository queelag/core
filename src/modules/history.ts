import { DEFAULT_HISTORY_DATA } from '../definitions/constants'
import { HistoryData, HistoryDataTarget } from '../definitions/interfaces'
import { ModuleLogger } from '../loggers/module.logger'
import { cloneObject } from '../utils/object.utils'

/**
 * A module to handle history changes.
 *
 * @category Module
 */
export class History<T extends HistoryDataTarget = HistoryDataTarget> {
  data: HistoryData<T>

  constructor(key: keyof T, target: T) {
    this.data = DEFAULT_HISTORY_DATA()
    this.data.key = key
    this.data.target = target
    this.data.versions.push(cloneObject(this.data.target[this.data.key]))
  }

  redo(): void {
    if (this.isNotRedoable) {
      return ModuleLogger.warn('History', 'redo', `This is not redoable.`)
    }

    this.setIndex(1)
  }

  undo(): void {
    if (this.isNotUndoable) {
      return ModuleLogger.warn('History', 'undo', `This is not undoable.`)
    }

    this.setIndex(-1)
  }

  push(): void {
    if (this.isRedoable) {
      this.data.versions = []
      ModuleLogger.debug('History', 'push', `The value versions have been reset.`)
    }

    this.data.versions = [...this.data.versions, cloneObject(this.data.target[this.data.key])].slice(0, this.data.size)
    this.data.index = this.data.versions.length - 1
  }

  private setIndex(offset: number): void {
    this.data.index = this.data.index + offset
    this.data.target[this.data.key] = cloneObject(this.data.versions[this.data.index])
  }

  get isRedoable(): boolean {
    return this.data.index < this.data.versions.length - 1
  }

  get isNotRedoable(): boolean {
    return this.isRedoable === false
  }

  get isUndoable(): boolean {
    return this.data.index > 0 && this.data.versions.length > 1
  }

  get isNotUndoable(): boolean {
    return this.isUndoable === false
  }
}
