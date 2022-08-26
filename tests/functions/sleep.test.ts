import { sleep } from '../../src'

describe('sleep', () => {
  it('waits for the amount of ms time specified', async () => {
    let d1: number, d2: number

    d1 = Date.now()
    await sleep(100)
    d2 = Date.now()

    // approximate
    expect(d2 - d1).toBeGreaterThanOrEqual(90)
  })
})
