import { FetchResponse } from './fetch-response.js'

/**
 * The FetchError class is used for errors that are returned by the Fetch class.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/fetch-error)
 */
export class FetchError<T = unknown> extends Error {
  /**
   * The response that caused the error.
   */
  response: FetchResponse<T>

  constructor(error: Error, response: FetchResponse<T>) {
    super(error.message)

    this.name = error.name
    this.stack = error.stack
    this.response = response
  }

  /**
   * Creates a new FetchError instance.
   */
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
