import { rcp } from '../../src'

describe('rcp', () => {
  it('returns the custom value', async () => {
    expect(await rcp(() => 0, 1)).toBe(1)
  })
})
