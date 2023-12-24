import { DEFAULT_HISTORY_SIZE } from '../definitions/constants.js'
import { HistoryDataTarget } from '../definitions/interfaces.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { cloneObject } from '../utils/object-utils.js'

export class History<T extends HistoryDataTarget = HistoryDataTarget, K extends keyof T = keyof T> {
  index: number
  key: K
  size: number
  target: T
  versions: T[K][]

  constructor(target: T, key: K, size: number = DEFAULT_HISTORY_SIZE) {
    this.index = 0
    this.key = key
    this.size = size
    this.target = target
    this.versions = [cloneObject(this.target[this.key], 'deep')]
  }

  redo(): void {
    if (this.isNotRedoable) {
      return ClassLogger.warn('History', 'redo', `This is not redoable.`)
    }

    this.setIndex(1)
  }

  undo(): void {
    if (this.isNotUndoable) {
      return ClassLogger.warn('History', 'undo', `This is not undoable.`)
    }

    this.setIndex(-1)
  }

  push(): void {
    if (this.isNotPushable) {
      this.versions = this.versions.slice(1, this.size)
      ClassLogger.debug('History', 'push', `The first version has been removed.`)
    }

    this.versions = [...this.versions, cloneObject(this.target[this.key], 'deep')]
    this.index = this.versions.length - 1
  }

  protected setIndex(offset: number): void {
    this.index = this.index + offset
    this.target[this.key] = cloneObject(this.versions[this.index], 'deep')
  }

  get isPushable(): boolean {
    return this.versions.length < this.size
  }

  get isNotPushable(): boolean {
    return this.isPushable === false
  }

  get isRedoable(): boolean {
    return this.index < this.versions.length - 1
  }

  get isNotRedoable(): boolean {
    return this.isRedoable === false
  }

  get isUndoable(): boolean {
    return this.index > 0
  }

  get isNotUndoable(): boolean {
    return this.isUndoable === false
  }
}
