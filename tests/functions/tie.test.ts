import { tie } from '../../src'

describe('tie', () => {
  it('throws if value is error', () => {
    expect(() => tie(new Error())).toThrow()
  })

  it('does not throw if value is not error', () => {
    expect(tie(0)).toBe(0)
  })
})
