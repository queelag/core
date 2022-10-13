import { describe, expect, it } from 'vitest'
import { getDateUnixTime } from '../../src'

describe('DateUtils', () => {
  it('gets date in ms', () => {
    let date: Date

    date = new Date()

    expect(getDateUnixTime(date)).toBe(date.valueOf())
    expect(getDateUnixTime(date.valueOf())).toBe(date.valueOf())
    expect(getDateUnixTime(date.toISOString())).toBe(date.valueOf())

    expect(getDateUnixTime(date, 's')).toBe(date.valueOf() / 100)
  })
})
