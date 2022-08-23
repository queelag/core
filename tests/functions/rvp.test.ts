import { rvp } from '../../src'

describe('rvp', () => {
  it('returns void', async () => {
    expect(await rvp(() => 0)).toBeUndefined()
  })
})
