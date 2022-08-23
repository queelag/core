import { Debounce, sleep } from '../../src'

describe('Debounce', () => {
  it('works', async () => {
    let fn: jest.Mock

    fn = jest.fn()

    Debounce.handle(fn, 10)
    expect(fn).not.toBeCalled()

    await sleep(10)
    expect(fn).toBeCalledTimes(1)

    Debounce.handle(fn, 10)
    await sleep(5)
    Debounce.handle(fn, 10)
    await sleep(10)

    expect(fn).toBeCalledTimes(2)
  })
})
