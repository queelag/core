import { FetchResponse } from './fetch-response.js'

/**
 * A class made for Fetch errors.
 *
 * @category Class
 */
export class FetchError<T = unknown> extends Error {
  response: FetchResponse<T>

  constructor(error: Error, response: FetchResponse<T>) {
    super(error.message)

    this.name = error.name
    this.stack = error.stack
    this.response = response
  }

  static from<T>(): FetchError<T>
  static from<T>(error: Error): FetchError<T>
  static from<T>(error: Error, response: FetchResponse<T>): FetchError<T>
  static from<T>(response: FetchResponse<T>): FetchError<T>
  static from<T>(...args: any[]): FetchError<T> {
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
