import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { sleep, throttle, ThrottleMapKey } from '../../src'

describe('Throttle', () => {
  let fn: Mock, key: ThrottleMapKey

  beforeEach(() => {
    fn = vi.fn()
    key = Symbol('throttle')
  })

  it('works with fn as key', async () => {
    throttle(fn, 10)
    expect(fn).toHaveBeenCalledTimes(1)

    throttle(fn, 10)
    expect(fn).toHaveBeenCalledTimes(1)

    await sleep(10)

    throttle(fn, 10)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('works with name as key', async () => {
    throttle(fn, 10, key)
    expect(fn).toHaveBeenCalledTimes(1)

    throttle(fn, 10, key)
    expect(fn).toHaveBeenCalledTimes(1)

    await sleep(10)

    throttle(fn, 10, key)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
