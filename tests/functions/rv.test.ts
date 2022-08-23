import { rv } from '../../src'

describe('rv', () => {
  it('returns void', () => {
    expect(rv(() => 0)).toBeUndefined()
  })
})
