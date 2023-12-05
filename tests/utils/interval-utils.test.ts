import { afterAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { clearEveryInterval, clearInterval, isIntervalSet, isIntervalUnset, setInterval, sleep } from '../../src'

describe('Interval Utils', () => {
  let fn: Mock, name: string

  beforeEach(() => {
    fn = vi.fn()
    name = 'interval'
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
    setInterval(name, fn, 10)
    expect(isIntervalSet(name)).toBeTruthy()

    await sleep(100)
    // approximate
    expect(fn).toBeCalled()

    clearInterval(name)
    expect(isIntervalUnset(name)).toBeTruthy()
  })

  it('runs the fn on start if autorun is true', async () => {
    setInterval(fn, 10, true)
    expect(fn).toBeCalled()
    clearInterval(fn)
  })
})
