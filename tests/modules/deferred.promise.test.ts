import { DeferredPromise } from '../../src'
import { PromiseState } from '../../src/definitions/enums'

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
    expect(promise.state).toBe(PromiseState.PENDING)
    expect(promise.isFulfilled).toBeFalsy()
    expect(promise.isPending).toBeTruthy()
    expect(promise.isRejected).toBeFalsy()
    expect(promise.isResolved).toBeFalsy()

    setTimeout(() => promise.resolve(0), 100)
    expect(await promise.instance).toBe(0)

    expect(onfinally).toBeCalled()
    expect(onfulfilled).toBeCalled()
    expect(onrejected).not.toBeCalled()

    expect(promise.isFulfilled).toBeTruthy()
    expect(promise.isPending).toBeFalsy()
    expect(promise.isRejected).toBeFalsy()
    expect(promise.isResolved).toBeTruthy()
  })

  it('rejects', async () => {
    expect(promise.instance).toBeInstanceOf(Promise)
    setTimeout(() => promise.reject(0), 100)
    await expect(() => promise.instance).rejects.toBe(0)

    expect(onfinally).toBeCalled()
    expect(onfulfilled).not.toBeCalled()
    expect(onrejected).toBeCalled()

    expect(promise.isFulfilled).toBeFalsy()
    expect(promise.isPending).toBeFalsy()
    expect(promise.isRejected).toBeTruthy()
    expect(promise.isResolved).toBeFalsy()
  })
})
