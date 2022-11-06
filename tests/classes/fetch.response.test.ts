import { beforeAll, describe, expect, it } from 'vitest'
import { FetchResponse, Polyfill, setObjectProperty, tne } from '../../src'
import { Configuration } from '../../src/modules/configuration'

describe('FetchResponse', () => {
  let response: FetchResponse<any>

  beforeAll(async () => {
    await Polyfill.fetch()
  })

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

    Configuration.module.tcp.log = false

    response.headers.set('content-type', 'application/octet-stream')
    await response.parse()
    expect(response.data).toStrictEqual(new Blob())

    response.headers.set('content-type', 'application/json')
    await response.parse()
    expect(response.data).toStrictEqual({})

    response.headers.set('content-type', 'multipart/form-data')
    await response.parse()
    expect(response.data).toStrictEqual(new FormData())

    response.headers.set('content-type', 'text/plain')
    await response.parse()
    expect(response.data).toBe('')

    response.headers.delete('content-type')
    await response.parse()
    expect(response.data).toStrictEqual(new ArrayBuffer(0))

    Configuration.module.tcp.log = false
  })
})
