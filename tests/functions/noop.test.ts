import { noop } from '../../src'

describe('noop', () => {
  it('returns void', () => {
    expect(noop()).toBeUndefined()
  })
})
