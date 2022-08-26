import { getDateInMilliseconds } from '../../src'

describe('DateUtils', () => {
  it('gets date in ms', () => {
    let date: Date

    date = new Date()

    expect(getDateInMilliseconds(date)).toBe(date.valueOf())
    expect(getDateInMilliseconds(date.valueOf())).toBe(date.valueOf())
    expect(getDateInMilliseconds(date.toISOString())).toBe(date.valueOf())
  })
})
