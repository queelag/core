import { afterAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { clearEveryTimeout, clearTimeout, isTimeoutSet, isTimeoutUnset, setTimeout, sleep } from '../../src'

describe('Timeout Utils', () => {
  let fn: Mock, name: string

  beforeEach(() => {
    fn = vi.fn()
    name = 'timeout'
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
    setTimeout(name, fn, 10)
    expect(isTimeoutSet(name)).toBeTruthy()
    expect(isTimeoutUnset(name)).toBeFalsy()

    await sleep(10)
    expect(fn).toBeCalledTimes(1)

    fn.mockReset()

    setTimeout(name, fn, 10)
    expect(isTimeoutSet(name)).toBeTruthy()
    expect(isTimeoutUnset(name)).toBeFalsy()

    clearTimeout(name)
    expect(isTimeoutSet(name)).toBeFalsy()
    expect(isTimeoutUnset(name)).toBeTruthy()

    await sleep(10)
    expect(fn).not.toBeCalled()
  })

  it('fails to unset missing timeout', () => {
    clearTimeout(fn)
  })
})
