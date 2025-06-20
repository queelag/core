import { describe, expect, it } from 'vitest'
import { FetchResponse, setObjectProperty, tne } from '../../src'
import { Configuration } from '../../src/classes/configuration'

describe('FetchResponse', () => {
  let response: FetchResponse<any>

  it('constructs', () => {
    let r: Response

    response = FetchResponse.from({})
    expect(response.data).toStrictEqual({})

    r = new Response()
    response = FetchResponse.from(r)
    expect(response.clone()).toMatchObject(r)
  })

  it('is clonable', () => {
    let clone: Response

    response = FetchResponse.from({})
    clone = response.clone()

    // expect(response).toMatchObject(clone)
  })

  it('fails to parse data safely', async () => {
    response = FetchResponse.from({})
    setObjectProperty(response, 'arrayBuffer', tne)
    setObjectProperty(response, 'blob', tne)
    setObjectProperty(response, 'formData', tne)
    setObjectProperty(response, 'json', tne)
    setObjectProperty(response, 'text', tne)

    Configuration.functions.tcp.log = false

    response.headers.set('content-type', 'application/octet-stream')
    await response.decode()
    expect(response.data).toStrictEqual(new Blob())

    response.headers.set('content-type', 'application/json')
    await response.decode()
    expect(response.data).toStrictEqual({})

    response.headers.set('content-type', 'application/x-www-form-urlencoded')
    await response.decode()
    expect(response.data).toBeInstanceOf(URLSearchParams)

    response.headers.set('content-type', 'multipart/form-data')
    await response.decode()
    expect(response.data).toStrictEqual(new FormData())

    response.headers.set('content-type', 'text/plain')
    await response.decode()
    expect(response.data).toBe('')

    response.headers.delete('content-type')
    await response.decode()
    expect(response.data).toStrictEqual(new ArrayBuffer(0))

    Configuration.functions.tcp.log = false
  })
})
