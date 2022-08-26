import { Interval, sleep } from '../../src'

describe('Interval', () => {
  let fn: jest.Mock, name: string

  beforeEach(() => {
    fn = jest.fn()
    name = 'interval'
  })

  afterAll(() => {
    Interval.clear()
  })

  it('works with fn as key', async () => {
    Interval.start(fn, 10)
    expect(Interval.isRunning(fn)).toBeTruthy()

    await sleep(100)
    expect(fn).toBeCalled()

    Interval.stop(fn)
    expect(Interval.isNotRunning(fn)).toBeTruthy()
  })

  it('works with name as key', async () => {
    Interval.start(name, fn, 10)
    expect(Interval.isRunning(name)).toBeTruthy()

    await sleep(100)
    expect(fn).toBeCalled()

    Interval.stop(name)
    expect(Interval.isNotRunning(name)).toBeTruthy()
  })

  it('runs the fn on start if autorun is true', async () => {
    Interval.start(fn, 10, true)
    expect(fn).toBeCalled()
    Interval.stop(fn)
  })
})
