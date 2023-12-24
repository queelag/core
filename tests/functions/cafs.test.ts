import { describe, expect, it } from 'vitest'
import { cafs } from '../../src'

describe('cafs', () => {
  it('runs', async () => {
    let a1: number[], p1: () => Promise<number>, p2: () => Promise<number>

    a1 = []
    p1 = async () => a1.push(0)
    p2 = async () => a1.push(1)

    await cafs(p1, p2)
    expect(a1).toStrictEqual([0, 1])
  })
})
