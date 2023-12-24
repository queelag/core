import { beforeAll, describe, expect, it } from 'vitest'
import { cafsueof } from '../../src'
import { Configuration } from '../../src/classes/configuration'

describe('cafsueof', () => {
  beforeAll(() => {
    Configuration.functions.tcp.log = false
  })

  it('runs until error or falsy', async () => {
    let a1: number[], p1: () => Promise<number>, p2: () => Promise<number>, p3: () => Promise<false>, p4: () => Promise<Error>

    a1 = []
    p1 = async () => a1.push(0)
    p2 = async () => a1.push(1)
    p3 = async () => false
    p4 = async () => new Error()

    await cafsueof(p1, p2)
    expect(a1).toStrictEqual([0, 1])

    a1 = []

    await cafsueof(p1, p3, p2)
    expect(a1).toStrictEqual([0])

    a1 = []

    await cafsueof(p1, p4, p2)
    expect(a1).toStrictEqual([0])
  })
})
