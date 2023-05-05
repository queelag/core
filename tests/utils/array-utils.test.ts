import { beforeEach, describe, expect, it } from 'vitest'
import { cloneShallowArray, getArrayLastItem, getArraysDifference, getArraysIntersection, removeArrayDuplicates, removeArrayItems } from '../../src'

describe('ArrayUtils', () => {
  let a1: number[], a2: number[], m1: number[][], m2: number[][]

  beforeEach(() => {
    a1 = [0, 0, 1, 2, 3]
    a2 = [5, 5, 4, 3, 2]
    m1 = [[0], [1], [2], [3]]
    m2 = [[5], [4], [3], [2]]
  })

  it('clones an array shallowly', () => {
    let clone: number[]

    clone = cloneShallowArray(a1)
    clone[0] = 1
    expect(a1[0]).toBe(0)
  })

  it('gets the difference between n arrays', () => {
    expect(getArraysDifference([a1, a2])).toStrictEqual([0, 1, 5, 4])
    expect(getArraysDifference([m1, m2], (array: number[][], item: number[]) => Boolean(array.find((value: number[]) => value[0] === item[0])))).toStrictEqual([
      [0],
      [1],
      [5],
      [4]
    ])
  })

  it('gets the intersection between n arrays', () => {
    expect(getArraysIntersection([a1, a2])).toStrictEqual([2, 3])
    expect(
      getArraysIntersection([m1, m2], (array: number[][], item: number[]) => Boolean(array.find((value: number[]) => value[0] === item[0])))
    ).toStrictEqual([[2], [3]])
  })

  it('gets the last item', () => {
    expect(getArrayLastItem(a1)).toBe(3)
    expect(getArrayLastItem(a2)).toBe(2)
    expect(getArrayLastItem([])).toBe(undefined)
    expect(getArrayLastItem([], 0)).toBe(0)
  })

  it('removes duplicates', () => {
    expect(removeArrayDuplicates([...a1, ...a2])).toStrictEqual([0, 1, 2, 3, 5, 4])
    expect(
      removeArrayDuplicates([...m1, ...m2], (array: number[][], item: number[]) => Boolean(array.find((value: number[]) => value[0] === item[0])))
    ).toStrictEqual([[0], [1], [2], [3], [5], [4]])
  })

  it('removes items', () => {
    expect(removeArrayItems(a1, [])).toStrictEqual(a1)
    expect(removeArrayItems(a1, [1, 2])).toStrictEqual([0, 0, 3])
    expect(removeArrayItems(m1, (array: number[][], item: number[]) => [1, 2].includes(item[0]))).toStrictEqual([[0], [3]])
  })
})
