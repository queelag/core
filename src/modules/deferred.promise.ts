import { noop } from '../functions/noop'
import { tcp } from '../functions/tcp'

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
  /**
   * Rejects the promise.
   */
  reject: (reason?: any) => void = noop
  /**
   * Resolves the promise.
   */
  resolve: (value: T | PromiseLike<T>) => void = noop

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
}
