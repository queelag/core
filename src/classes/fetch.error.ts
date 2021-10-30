import { FetchResponse } from './fetch.response'

/**
 * A class made for Fetch errors.
 *
 * @category Class
 */
export class FetchError<T = void> extends Error {
  response: FetchResponse<T>

  constructor(error: Error, response: FetchResponse<T>) {
    super(error.message)

    this.name = error.name
    this.stack = error.stack
    this.response = response
  }

  static from<T = void>(): FetchError<T>
  static from<T = void>(error: Error): FetchError<T>
  static from<T = void>(error: Error, response: FetchResponse<T>): FetchError<T>
  static from<T = void>(response: FetchResponse<T>): FetchError<T>
  static from<T = void>(...args: any): FetchError<T> {
    switch (true) {
      case args[0] instanceof Error && args[1] instanceof FetchResponse:
        return new FetchError(args[0], args[1])
      case args[0] instanceof Error:
        return new FetchError(args[0], new FetchResponse(new Response()))
      case args[0] instanceof FetchResponse:
        return new FetchError(new Error(), args[0])
      default:
        return new FetchError(new Error(), new FetchResponse(new Response()))
    }
  }
}
