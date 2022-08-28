import { debounce, sleep } from '../../src'

describe('Debounce', () => {
  let fn: jest.Mock, name: string

  beforeEach(() => {
    fn = jest.fn()
    name = 'debounce'
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
    debounce(name, fn, 10)
    expect(fn).not.toBeCalled()

    await sleep(10)
    expect(fn).toBeCalledTimes(1)

    debounce(name, fn, 10)
    await sleep(5)
    debounce(name, fn, 10)
    await sleep(10)

    expect(fn).toBeCalledTimes(2)
  })
})
