import { API, CoreConfiguration, FetchError, FetchResponse, RequestMethod, Status, WriteMode } from '../../src'
import { closeServer, openServer } from '../server'

function getResponseData<T>(response: FetchResponse<T> | FetchError<any>): T {
  if (response instanceof Error) {
    throw response
  }

  return response.data
}

function getResponseHeaders<T>(response: FetchResponse<T> | FetchError<any>): Headers {
  if (response instanceof Error) {
    throw response
  }

  return response.headers
}

describe('API', () => {
  let address: string, api: API, response: FetchResponse<any> | FetchError<any>

  beforeAll(async () => {
    address = await openServer()
  })

  beforeEach(() => {
    api = new API(address)
  })

  afterAll(async () => {
    await closeServer()
  })

  it('constructs', () => {
    api = new API()
    expect(api.baseURL).toBe('')
    expect(api.config).toStrictEqual({})

    api = new API(address)
    expect(api.baseURL).toBe(address)
    expect(api.config).toStrictEqual({})

    api = new API(address, { headers: [['authorization', 'token']] })
    expect(api.baseURL).toBe(address)
    expect(api.config).toStrictEqual({ headers: [['authorization', 'token']] })
  })

  it('handles connect requests', async () => {
    CoreConfiguration.module.tcp.log = false

    response = await api.connect('any')
    expect(response).toBeInstanceOf(Error)

    CoreConfiguration.module.tcp.log = true
  })

  it('handles delete requests', async () => {
    response = await api.delete('any')
    expect(response).not.toBeInstanceOf(Error)
  })

  it('handles get requests', async () => {
    response = await api.get('blob')
    expect(getResponseData(response)).toBeInstanceOf(Blob)
    // expect(await getResponseData<Blob>(response).arrayBuffer()).toStrictEqual([0])

    response = await api.get('buffer')
    expect(getResponseData(response)).toBeInstanceOf(ArrayBuffer)
    // expect(getResponseData(response)).toStrictEqual([0])

    response = await api.get('json')
    expect(getResponseData(response)).toMatchObject({ a: 0 })

    response = await api.get('text')
    expect(getResponseData(response)).toBe('hello')
  })

  it('handles head requests', async () => {
    response = await api.head('any')
    expect(response).not.toBeInstanceOf(Error)
  })

  it('handles options requests', async () => {
    response = await api.options('any')
    expect(response).not.toBeInstanceOf(Error)
  })

  it('handles patch requests', async () => {
    response = await api.patch('any', 'hello')
    expect(getResponseData(response)).toBe('hello')
  })

  it('handles post requests', async () => {
    response = await api.post('any', 'hello')
    expect(getResponseData(response)).toBe('hello')
  })

  it('handles put requests', async () => {
    response = await api.put('any', 'hello')
    expect(getResponseData(response)).toBe('hello')
  })

  it('handles trace requests', async () => {
    CoreConfiguration.module.tcp.log = false

    response = await api.trace('any')
    expect(response).toBeInstanceOf(Error)

    CoreConfiguration.module.tcp.log = true
  })

  it('handles write', async () => {
    response = await api.write(WriteMode.CREATE, 'any', 'hello')
    expect(getResponseHeaders(response).get('method')).toBe(RequestMethod.POST)

    response = await api.write(WriteMode.UPDATE, 'any', 'hello')
    expect(getResponseHeaders(response).get('method')).toBe(RequestMethod.PUT)
  })

  it('has working status implementation', async () => {
    let response: Promise<FetchResponse | FetchError>

    expect(api.status.isIdle(RequestMethod.GET, 'text')).toBeTruthy()
    response = api.get('text')
    expect(api.status.isPending(RequestMethod.GET, 'text')).toBeTruthy()

    await response

    expect(api.status.isSuccess(RequestMethod.GET, 'text')).toBeTruthy()

    response = api.get('error')
    expect(api.status.isPending(RequestMethod.GET, 'error')).toBeTruthy()

    await response

    expect(api.status.isError(RequestMethod.GET, 'error')).toBeTruthy()
  })

  it('has working status blacklist', async () => {
    let response: Promise<FetchResponse | FetchError>

    expect(api.status.isIdle(RequestMethod.GET, 'text')).toBeTruthy()
    response = api.get('text', { status: { blacklist: [Status.ERROR, Status.IDLE, Status.PENDING, Status.SUCCESS] } })
    expect(api.status.isIdle(RequestMethod.GET, 'text')).toBeTruthy()

    await response

    expect(api.status.isIdle(RequestMethod.GET, 'text')).toBeTruthy()

    await api.get('error')
    expect(api.status.isError(RequestMethod.GET, 'error')).toBeTruthy()
  })

  it('has working status whitelist', async () => {
    let response: Promise<FetchResponse | FetchError>

    expect(api.status.isIdle(RequestMethod.GET, 'text')).toBeTruthy()
    response = api.get('text', { status: { whitelist: [] } })
    expect(api.status.isIdle(RequestMethod.GET, 'text')).toBeTruthy()

    await response

    expect(api.status.isIdle(RequestMethod.GET, 'text')).toBeTruthy()

    await api.get('error')
    expect(api.status.isError(RequestMethod.GET, 'error')).toBeTruthy()
  })

  it('has working status based handlers', async () => {
    api.handleError = jest.fn(async () => false)
    api.handlePending = jest.fn(async () => true)
    api.handleSuccess = jest.fn(async () => true)

    await api.get('text')
    expect(api.handleError).not.toBeCalled()
    expect(api.handlePending).toBeCalled()
    expect(api.handleSuccess).toBeCalled()

    api.handleError = jest.fn(async () => false)
    api.handlePending = jest.fn(async () => true)
    api.handleSuccess = jest.fn(async () => true)

    await api.get('error')
    expect(api.handleError).toBeCalled()
    expect(api.handlePending).toBeCalled()
    expect(api.handleSuccess).not.toBeCalled()

    api.handleError = jest.fn(async () => true)

    await api.get('error')
    expect(api.status.isError(RequestMethod.GET, 'error')).toBeFalsy()

    api.handlePending = jest.fn(async () => false)

    response = await api.get('text')
    expect(response).toBeInstanceOf(Error)
    expect(api.status.isError(RequestMethod.GET, 'text')).toBeTruthy()

    api.handlePending = jest.fn(async () => true)
    api.handleSuccess = jest.fn(async () => false)

    response = await api.get('text')
    expect(response).toBeInstanceOf(Error)
    expect(api.status.isError(RequestMethod.GET, 'text')).toBeTruthy()
  })

  it('transforms body', async () => {
    api.transformBody = jest.fn()

    response = await api.post('any')
    expect(api.transformBody).toBeCalled()

    api.transformBody = async () => 'world'

    response = await api.post('any')
    expect(getResponseData(response)).toBe('world')
  })

  it('transforms query parameters', async () => {
    response = await api.get('query', { query: { a: 0 } })
    expect(getResponseData(response)).toMatchObject({ a: '0' })

    api.transformQueryParameters = async () => 'b=1'

    response = await api.get('query', { query: 'a=0' })
    expect(getResponseData(response)).toMatchObject({ b: '1' })
  })
})
