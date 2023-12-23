import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { debounce, DebounceMapKey, sleep } from '../../src'

describe('Debounce', () => {
  let fn: Mock, key: DebounceMapKey

  beforeEach(() => {
    fn = vi.fn()
    key = Symbol('debounce')
  })

  it('works with fn as key', async () => {
    debounce(fn, 10)
    expect(fn).not.toBeCalled()

    await sleep(10)
    expect(fn).toBeCalledTimes(1)

    debounce(fn, 10)
    await sleep(5)
    debounce(fn, 10)
    await sleep(10)

    expect(fn).toBeCalledTimes(2)
  })

  it('works with name as key', async () => {
    debounce(fn, 10, key)
    expect(fn).not.toBeCalled()

    await sleep(10)
    expect(fn).toBeCalledTimes(1)

    debounce(fn, 10, key)
    await sleep(5)
    debounce(fn, 10, key)
    await sleep(10)

    expect(fn).toBeCalledTimes(2)
  })
})
