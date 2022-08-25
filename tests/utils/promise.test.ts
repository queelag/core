import { chainPromises, chainTruthyPromises } from '../../src'

describe('PromiseUtils', () => {
  it('chains', async () => {
    let a1: number[], p1: () => Promise<number>, p2: () => Promise<number>

    a1 = []
    p1 = async () => a1.push(0)
    p2 = async () => a1.push(1)

    await chainPromises(p1, p2)
    expect(a1).toStrictEqual([0, 1])
  })

  it('chains till result is truthy', async () => {
    let a1: number[], p1: () => Promise<number>, p2: () => Promise<number>, p3: () => Promise<false>, p4: () => Promise<Error>

    a1 = []
    p1 = async () => a1.push(0)
    p2 = async () => a1.push(1)
    p3 = async () => false
    p4 = async () => new Error()

    await chainTruthyPromises(p1, p2)
    expect(a1).toStrictEqual([0, 1])

    a1 = []

    await chainTruthyPromises(p1, p3, p2)
    expect(a1).toStrictEqual([0])

    a1 = []

    await chainTruthyPromises(p1, p4, p2)
    expect(a1).toStrictEqual([0])
  })
})
