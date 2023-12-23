import { afterAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { clearEveryInterval, clearInterval, IntervalMapKey, isIntervalSet, isIntervalUnset, setInterval, sleep } from '../../src'

describe('Interval Utils', () => {
  let fn: Mock, key: IntervalMapKey

  beforeEach(() => {
    fn = vi.fn()
    key = Symbol('interval')
  })

  afterAll(() => {
    clearEveryInterval()
  })

  it('works with fn as key', async () => {
    setInterval(fn, 10)
    expect(isIntervalSet(fn)).toBeTruthy()

    await sleep(100)
    // approximate
    expect(fn).toBeCalled()

    clearInterval(fn)
    expect(isIntervalUnset(fn)).toBeTruthy()
  })

  it('works with name as key', async () => {
    setInterval(fn, 10, key)
    expect(isIntervalSet(key)).toBeTruthy()

    await sleep(100)
    // approximate
    expect(fn).toBeCalled()

    clearInterval(key)
    expect(isIntervalUnset(key)).toBeTruthy()
  })

  it('runs the fn on start if autorun is true', async () => {
    setInterval(fn, 10, key, { autorun: true })
    expect(fn).toBeCalled()
    clearInterval(fn)
  })
})
