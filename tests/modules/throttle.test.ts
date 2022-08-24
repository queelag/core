import { sleep, Throttle } from '../../src'

describe('Throttle', () => {
  let fn: jest.Mock, name: string

  beforeEach(() => {
    fn = jest.fn()
    name = 'throttle'
  })

  it('works with fn as key', async () => {
    Throttle.handle(fn, 10)
    expect(fn).toBeCalledTimes(1)

    Throttle.handle(fn, 10)
    expect(fn).toBeCalledTimes(1)

    await sleep(10)

    Throttle.handle(fn, 10)
    expect(fn).toBeCalledTimes(2)
  })

  it('works with name as key', async () => {
    Throttle.handle(name, fn, 10)
    expect(fn).toBeCalledTimes(1)

    Throttle.handle(name, fn, 10)
    expect(fn).toBeCalledTimes(1)

    await sleep(10)

    Throttle.handle(name, fn, 10)
    expect(fn).toBeCalledTimes(2)
  })
})
