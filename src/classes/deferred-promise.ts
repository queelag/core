import { PromiseState } from '../definitions/enums.js'
import { tcp } from '../functions/tcp.js'
import { isPromiseLike } from '../utils/promise-utils.js'

/**
 * The DeferredPromise class is built on top of the native Promise class. It provides a way to resolve or reject a promise from the outside.
 */
export class DeferredPromise<T> {
  /**
   * The native promise instance.
   */
  readonly instance: Promise<T>
  /**
   * The reason for the rejection of the promise.
   */
  reason?: any
  /**
   * The state of the promise, can be pending, fulfilled or rejected.
   */
  state: PromiseState
  /**
   * The value of the resolved promise.
   */
  value?: T

  private _reject!: (reason?: any) => void
  private _resolve!: (value: T | PromiseLike<T>) => void

  constructor() {
    this.state = PromiseState.PENDING
    this.instance = new Promise((resolve: (v: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => {
      this._reject = reject
      this._resolve = resolve
    })
  }

  reject(reason?: any): void {
    this._reject(reason)

    this.reason = reason
    this.state = PromiseState.REJECTED
  }

  /**
   * Resolves the promise with a value or the result of another promise.
   */
  resolve(value: T | PromiseLike<T>): void {
    this._resolve(value)
    this.state = PromiseState.FULFILLED

    if (isPromiseLike(value)) {
      value.then((v: T) => {
        this.value = v
      })

      return
    }

    this.value = value
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): this {
    tcp(() => this.instance.catch(onrejected), false)
    return this
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): this {
    tcp(() => this.instance.finally(onfinally), false)
    return this
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): this {
    tcp(() => this.instance.then(onfulfilled, onrejected), false)
    return this
  }

  /**
   * Checks if the promise is fulfilled.
   */
  get isFulfilled(): boolean {
    return this.state === PromiseState.FULFILLED
  }

  /**
   * Checks if the promise is pending.
   */
  get isPending(): boolean {
    return this.state === PromiseState.PENDING
  }

  /**
   * Checks if the promise is rejected.
   */
  get isRejected(): boolean {
    return this.state === PromiseState.REJECTED
  }

  /**
   * Checks if the promise is resolved.
   */
  get isResolved(): boolean {
    return this.isFulfilled
  }
}
