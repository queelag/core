import { beforeEach, describe, expect, it } from 'vitest'
import { History } from '../../src'
import { DEFAULT_HISTORY_SIZE } from '../../src/definitions/constants'

class Store {
  static target: Record<string, number> = {}
}

describe('History', () => {
  let history: History

  beforeEach(() => {
    Store.target = {}
    history = new History(Store, 'target')
  })

  it('constructs', () => {
    expect(history.index).toBe(0)
    expect(history.key).toBe('target')
    expect(history.size).toBe(DEFAULT_HISTORY_SIZE)
    expect(history.target).toBe(Store)
    expect(history.versions).toStrictEqual([{}])
  })

  it('undoes and redoes', () => {
    Store.target.a = 0
    history.push()

    expect(history.index).toBe(1)
    expect(history.versions).toStrictEqual([{}, { a: 0 }])

    history.undo()

    expect(Store.target.a).toBeUndefined()
    expect(history.index).toBe(0)

    history.redo()

    expect(Store.target.a).toBe(0)
    expect(history.index).toBe(1)
  })

  it('does not undo if index is 0', () => {
    history.undo()
    expect(Store.target).toStrictEqual({})
  })

  it('does not redo if index is equal to size', () => {
    Store.target.a = 0

    for (let i = 0; i < history.size; i++) {
      Store.target.a++
      history.push()
    }

    history.redo()
    expect(Store.target.a).toBe(history.size)
  })

  it('handles overflowing versions', () => {
    Store.target.a = 0

    for (let i = 0; i < history.size * 2; i++) {
      Store.target.a++
      history.push()
    }

    expect(history.index).toBe(history.size - 1)
    expect(history.versions.length).toBe(history.size)
    expect(history.versions).toStrictEqual(new Array(100).fill(0).map((v, k: number) => ({ a: k + 1 + history.size })))
  })
})
