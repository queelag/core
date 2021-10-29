import { FetchResponse } from './fetch.response'

export class FetchError<T = void> extends Error {
  response: FetchResponse<T>

  constructor(error: Error, response: FetchResponse<T> = new FetchResponse(new Response())) {
    super(error.message)

    this.name = error.name
    this.stack = error.stack
    this.response = response
  }
}
