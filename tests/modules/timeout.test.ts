import { afterAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { sleep, Timeout } from '../../src'

describe('Timeout', () => {
  let fn: Mock, name: string

  beforeEach(() => {
    fn = vi.fn()
    name = 'timeout'
  })

  afterAll(() => {
    Timeout.clear()
  })

  it('works with fn as key', async () => {
    Timeout.set(fn, 10)
    expect(Timeout.isSet(fn)).toBeTruthy()
    expect(Timeout.isNotSet(fn)).toBeFalsy()

    await sleep(10)
    expect(fn).toBeCalledTimes(1)

    fn.mockReset()

    Timeout.set(fn, 10)
    expect(Timeout.isSet(fn)).toBeTruthy()
    expect(Timeout.isNotSet(fn)).toBeFalsy()

    Timeout.unset(fn)
    expect(Timeout.isSet(fn)).toBeFalsy()
    expect(Timeout.isNotSet(fn)).toBeTruthy()

    await sleep(10)
    expect(fn).not.toBeCalled()
  })

  it('works with name as key', async () => {
    Timeout.set(name, fn, 10)
    expect(Timeout.isSet(name)).toBeTruthy()
    expect(Timeout.isNotSet(name)).toBeFalsy()

    await sleep(10)
    expect(fn).toBeCalledTimes(1)

    fn.mockReset()

    Timeout.set(name, fn, 10)
    expect(Timeout.isSet(name)).toBeTruthy()
    expect(Timeout.isNotSet(name)).toBeFalsy()

    Timeout.unset(name)
    expect(Timeout.isSet(name)).toBeFalsy()
    expect(Timeout.isNotSet(name)).toBeTruthy()

    await sleep(10)
    expect(fn).not.toBeCalled()
  })

  it('fails to unset missing timeout', () => {
    Timeout.unset(fn)
  })
})
