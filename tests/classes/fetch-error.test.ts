import { beforeAll, describe, expect, it } from 'vitest'
import { FetchError, FetchResponse, Polyfill } from '../../src'

describe('FetchError', () => {
  let error: FetchError<any>

  beforeAll(async () => {
    await Polyfill.fetch()
  })

  it('constructs', () => {
    let e: Error, response: FetchResponse<any>

    error = FetchError.from()
    expect(error.message).toHaveLength(0)
    expect(error.stack?.length).toBeGreaterThan(0)
    expect(error.response).toBeInstanceOf(FetchResponse)

    e = new Error()
    error = FetchError.from(e)
    expect(error.message).toBe(e.message)
    expect(error.stack).toBe(e.stack)
    expect(error.response).toBeInstanceOf(FetchResponse)

    response = FetchResponse.from({})
    error = FetchError.from(e, response)
    expect(error.message).toBe(e.message)
    expect(error.stack).toBe(e.stack)
    expect(error.response).toStrictEqual(response)

    error = FetchError.from(response)
    expect(error.message).toHaveLength(0)
    expect(error.stack?.length).toBeGreaterThan(0)
    expect(error.response).toStrictEqual(response)
  })
})
