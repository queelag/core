import { afterAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { clearEveryTimeout, clearTimeout, isTimeoutSet, isTimeoutUnset, setTimeout, sleep, TimeoutMapKey } from '../../src'

describe('Timeout Utils', () => {
  let fn: Mock, key: TimeoutMapKey

  beforeEach(() => {
    fn = vi.fn()
    key = Symbol('timeout')
  })

  afterAll(() => {
    clearEveryTimeout()
  })

  it('works with fn as key', async () => {
    setTimeout(fn, 10)
    expect(isTimeoutSet(fn)).toBeTruthy()
    expect(isTimeoutUnset(fn)).toBeFalsy()

    await sleep(10)
    expect(fn).toBeCalledTimes(1)

    fn.mockReset()

    setTimeout(fn, 10)
    expect(isTimeoutSet(fn)).toBeTruthy()
    expect(isTimeoutUnset(fn)).toBeFalsy()

    clearTimeout(fn)
    expect(isTimeoutSet(fn)).toBeFalsy()
    expect(isTimeoutUnset(fn)).toBeTruthy()

    await sleep(10)
    expect(fn).not.toBeCalled()
  })

  it('works with name as key', async () => {
    setTimeout(fn, 10, key)
    expect(isTimeoutSet(key)).toBeTruthy()
    expect(isTimeoutUnset(key)).toBeFalsy()

    await sleep(10)
    expect(fn).toBeCalledTimes(1)

    fn.mockReset()

    setTimeout(fn, 10, key)
    expect(isTimeoutSet(key)).toBeTruthy()
    expect(isTimeoutUnset(key)).toBeFalsy()

    clearTimeout(key)
    expect(isTimeoutSet(key)).toBeFalsy()
    expect(isTimeoutUnset(key)).toBeTruthy()

    await sleep(10)
    expect(fn).not.toBeCalled()
  })

  it('fails to unset missing timeout', () => {
    clearTimeout(fn)
  })
})
