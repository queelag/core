/**
 * A module to handle deferred promises.
 *
 * @category Module
 */
export class DeferredPromise<T> {
  /**
   * A {@link Promise} instance.
   */
  instance: Promise<T>

  constructor() {
    this.instance = new Promise((resolve: (v: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => {
      this.reject = reject
      this.resolve = resolve
    })
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
    return this.instance.catch(onrejected)
  }

  /**
   * Rejects the promise.
   */
  reject(reason?: any): void {}

  /**
   * Resolves the promise.
   */
  resolve(value: T | PromiseLike<T>): void {}

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.instance.then(onfulfilled, onrejected)
  }
}
