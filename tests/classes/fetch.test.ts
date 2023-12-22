import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { CoreConfiguration, Fetch, FetchError, FetchResponse, tie } from '../../src'
import { closeServer, openServer } from '../server'

describe('Fetch', () => {
  let address: string, response: FetchResponse<any> | FetchError<any>

  beforeAll(async () => {
    address = await openServer(3001)
  })

  afterAll(async () => {
    await closeServer()
  })

  it('handles connect requests', async () => {
    CoreConfiguration.functions.tcp.log = false

    response = await Fetch.connect(`${address}/any`)
    expect(response).toBeInstanceOf(Error)

    CoreConfiguration.functions.tcp.log = true
  })

  it('handles delete requests', async () => {
    response = await Fetch.delete(`${address}/any`)
    expect(response).not.toBeInstanceOf(Error)
  })

  it('handles get requests', async () => {
    response = await Fetch.get(`${address}/blob`)
    expect(tie<FetchResponse>(response).data).toBeInstanceOf(Blob)
    // expect(tie<FetchResponse>(response).data).toStrictEqual([0])

    response = await Fetch.get(`${address}/buffer`)
    expect(tie<FetchResponse>(response).data).toBeInstanceOf(ArrayBuffer)
    // expect(tie<FetchResponse>(response).data).toStrictEqual([0])

    response = await Fetch.get(`${address}/json`)
    expect(tie<FetchResponse>(response).data).toMatchObject({ a: 0 })

    response = await Fetch.get(`${address}/text`)
    expect(tie<FetchResponse>(response).data).toBe('hello')

    response = await Fetch.get(`${address}/url-search-params`)
    expect(tie<FetchResponse>(response).data).toBeInstanceOf(URLSearchParams)
    expect(tie<FetchResponse<URLSearchParams>>(response).data.get('a')).toBe('0')
  })

  it('handles head requests', async () => {
    response = await Fetch.head(`${address}/any`)
    expect(response).not.toBeInstanceOf(Error)
  })

  it('handles options requests', async () => {
    response = await Fetch.options(`${address}/any`)
    expect(response).not.toBeInstanceOf(Error)
  })

  it('handles patch requests', async () => {
    response = await Fetch.patch(`${address}/any`, 'hello')
    expect(tie<FetchResponse>(response).data).toBe('hello')
  })

  it('handles post requests', async () => {
    response = await Fetch.post(`${address}/any`, 'hello')
    expect(tie<FetchResponse>(response).data).toBe('hello')
  })

  it('handles put requests', async () => {
    response = await Fetch.put(`${address}/any`, 'hello')
    expect(tie<FetchResponse>(response).data).toBe('hello')
  })

  it('handles trace requests', async () => {
    CoreConfiguration.functions.tcp.log = false

    response = await Fetch.trace(`${address}/any`)
    expect(response).toBeInstanceOf(Error)

    CoreConfiguration.functions.tcp.log = true
  })

  it('can throw during request', async () => {
    vi.spyOn(global, 'fetch').mockImplementationOnce(() => {
      throw new Error()
    })

    CoreConfiguration.functions.tcp.log = false

    response = await Fetch.get(`${address}/any`)
    expect(response).toBeInstanceOf(Error)

    CoreConfiguration.functions.tcp.log = true
  })

  it('works without request init', async () => {
    response = await Fetch.send(`${address}/any`)
    expect(response).toBeInstanceOf(FetchResponse)
  })
})
