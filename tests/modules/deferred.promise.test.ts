import { DeferredPromise } from '../../src'

describe('DeferredPromise', () => {
  let promise: DeferredPromise<number>, onfinally: jest.Mock, onfulfilled: jest.Mock, onrejected: jest.Mock

  beforeEach(() => {
    promise = new DeferredPromise()

    onfinally = jest.fn()
    onfulfilled = jest.fn()
    onrejected = jest.fn()

    promise.catch(onrejected).finally(onfinally).then(onfulfilled)
  })

  it('resolves', async () => {
    setTimeout(() => promise.resolve(0), 100)
    expect(await promise.instance).toBe(0)

    expect(onfinally).toBeCalled()
    expect(onfulfilled).toBeCalled()
    expect(onrejected).not.toBeCalled()
  })

  it('rejects', async () => {
    expect(promise.instance).toBeInstanceOf(Promise)
    setTimeout(() => promise.reject(0), 100)
    await expect(() => promise.instance).rejects.toBe(0)

    expect(onfinally).toBeCalled()
    expect(onfulfilled).not.toBeCalled()
    expect(onrejected).toBeCalled()
  })
})
