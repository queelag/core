import { describe, expect, it } from 'vitest'
import { cafsue } from '../../src'
import { Configuration } from '../../src/classes/configuration'

describe('cafsue', () => {
  it('runs until error', async () => {
    let a1: number[], p1: () => Promise<number>, p2: () => Promise<number>, p3: () => Promise<false>, p4: () => Promise<Error>

    Configuration.functions.tcp.log = false

    a1 = []
    p1 = async () => a1.push(0)
    p2 = async () => a1.push(1)
    p3 = async () => false
    p4 = async () => new Error()

    await cafsue(p1, p2)
    expect(a1).toStrictEqual([0, 1])

    a1 = []

    await cafsue(p1, p3, p2)
    expect(a1).toStrictEqual([0, 1])

    a1 = []

    await cafsue(p1, p4, p2)
    expect(a1).toStrictEqual([0])

    Configuration.functions.tcp.log = true
  })
})
