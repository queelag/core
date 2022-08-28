import { sleep, throttle } from '../../src'

describe('Throttle', () => {
  let fn: jest.Mock, name: string

  beforeEach(() => {
    fn = jest.fn()
    name = 'throttle'
  })

  it('works with fn as key', async () => {
    throttle(fn, 10)
    expect(fn).toBeCalledTimes(1)

    throttle(fn, 10)
    expect(fn).toBeCalledTimes(1)

    await sleep(10)

    throttle(fn, 10)
    expect(fn).toBeCalledTimes(2)
  })

  it('works with name as key', async () => {
    throttle(name, fn, 10)
    expect(fn).toBeCalledTimes(1)

    throttle(name, fn, 10)
    expect(fn).toBeCalledTimes(1)

    await sleep(10)

    throttle(name, fn, 10)
    expect(fn).toBeCalledTimes(2)
  })
})