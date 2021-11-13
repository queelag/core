import { FetchRequestInit } from '../definitions/interfaces'
import { Environment } from '../modules/environment'
import { ObjectUtils } from './object.utils'

/**
 * Utils for anything related to fetch.
 *
 * @category Utility
 */
export class FetchUtils {
  static setRequestInitHeaderOnlyIfUnset<V>(init: FetchRequestInit<V>, name: string, value: string): void {
    switch (true) {
      case init.headers instanceof Headers:
        let headers: Headers

        headers = init.headers as Headers
        if (headers.has(name)) return

        headers.set(name, value)
        break
      case Array.isArray(init.headers):
        let array: string[][]

        array = init.headers as string[][]
        if (array.some((v: string[]) => v[0] === name)) return

        array.push([name, value])
        break
      case typeof init.headers === 'object':
        let record: Record<string, string>

        record = init.headers as Record<string, string>
        if (record[name]) return

        record[name] = value
        break
      default:
        init.headers = new Headers()
        init.headers.set(name, value)

        break
    }
  }

  static async toRequestInit<V extends unknown>(init: FetchRequestInit<V>): Promise<RequestInit> {
    let clone: RequestInit

    clone = ObjectUtils.omit(init, ['body'])
    if (!init.body) return clone

    switch (true) {
      case init.body instanceof ArrayBuffer:
      case init.body instanceof Blob:
        clone.body = init.body as ArrayBuffer | Blob
        this.setRequestInitHeaderOnlyIfUnset(init, 'content-type', 'application/octet-stream')

        break
      case Environment.isWindowDefined && init.body instanceof FormData:
        clone.body = init.body as FormData
        this.setRequestInitHeaderOnlyIfUnset(init, 'content-type', 'multipart/form-data')

        break
      default:
        switch (typeof init.body) {
          case 'bigint':
          case 'boolean':
          case 'function':
          case 'number':
          case 'string':
          case 'symbol':
            clone.body = init.body.toString()
            this.setRequestInitHeaderOnlyIfUnset(init, 'content-type', 'text/plain')

            break
          case 'object':
            clone.body = JSON.stringify(init.body)
            this.setRequestInitHeaderOnlyIfUnset(init, 'content-type', 'application/json')

            break
          case 'undefined':
            break
        }

        break
    }

    return clone
  }
}
