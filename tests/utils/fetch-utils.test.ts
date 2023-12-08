import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import {
  FetchRequestInit,
  deleteFetchRequestInitHeader,
  getFetchRequestInitHeader,
  getFetchRequestInitHeadersLength,
  hasFetchRequestInitHeader,
  importNodeFetch,
  mergeFetchRequestInits,
  noop,
  setFetchRequestInitHeader,
  setFetchRequestInitHeaderWhenUnset,
  toLoggableFetchRequestInit,
  toLoggableNativeFetchRequestInit,
  toNativeFetchRequestInit,
  useNodeFetch
} from '../../src'

describe('Fetch Utils', () => {
  let init: FetchRequestInit<any>, inits: FetchRequestInit<any>[], native: RequestInit

  beforeAll(async () => {
    await useNodeFetch(await importNodeFetch())
  })

  beforeEach(() => {
    init = {}
    inits = []
    native = {}
  })

  it('cruds headers', () => {
    inits = [{}, { headers: new Headers() }, { headers: [] }, { headers: {} }]

    for (let init of inits) {
      deleteFetchRequestInitHeader(init, 'name')
      expect(getFetchRequestInitHeader(init, 'name')).toBeNull()
      expect(getFetchRequestInitHeadersLength(init)).toBe(0)

      setFetchRequestInitHeader(init, 'name', 'john')
      expect(getFetchRequestInitHeader(init, 'name')).toBe('john')
      expect(hasFetchRequestInitHeader(init, 'name')).toBeTruthy()

      setFetchRequestInitHeader(init, 'name', 'robert')
      expect(getFetchRequestInitHeader(init, 'name')).toBe('robert')
      expect(getFetchRequestInitHeadersLength(init)).toBe(1)

      deleteFetchRequestInitHeader(init, 'name')
      expect(hasFetchRequestInitHeader(init, 'name')).toBeFalsy()
      expect(getFetchRequestInitHeadersLength(init)).toBe(0)
    }
  })

  it('sets header only if unset', () => {
    inits = [{}, { headers: new Headers() }, { headers: [] }, { headers: {} }]

    for (let init of inits) {
      setFetchRequestInitHeaderWhenUnset(init, 'name', 'john')
      setFetchRequestInitHeaderWhenUnset(init, 'name', 'robert')
      expect(getFetchRequestInitHeader(init, 'name')).toBe('john')
      expect(getFetchRequestInitHeadersLength(init)).toBe(1)
    }
  })

  it('merges request inits', () => {
    let merged: FetchRequestInit

    init.headers = new Headers()
    init.headers.set('name', 'john')
    init.headers.set('surname', 'doe')

    inits = [{}, {}]
    inits[0].headers = [['name', 'robert']]
    inits[1].headers = { surname: 'smith' }

    merged = mergeFetchRequestInits(init, ...inits)
    expect(getFetchRequestInitHeader(merged, 'name')).toBe('robert')
    expect(getFetchRequestInitHeader(merged, 'surname')).toBe('smith')
    expect(getFetchRequestInitHeadersLength(merged)).toBe(2)

    init.headers = new Headers()
    merged = mergeFetchRequestInits(init)
    expect(merged.headers).toBeUndefined()
  })

  it('converts an internal request init to a native one', () => {
    init.body = undefined
    expect(toNativeFetchRequestInit(init)).toStrictEqual({})

    init.body = new ArrayBuffer(0)
    native = toNativeFetchRequestInit(init)
    expect(getFetchRequestInitHeader(native, 'content-type')).toBe('application/octet-stream')
    expect(native.body).toStrictEqual(init.body)

    init.body = new Blob([])
    native = toNativeFetchRequestInit(init)
    expect(getFetchRequestInitHeader(native, 'content-type')).toBe('application/octet-stream')
    expect(native.body).toStrictEqual(init.body)

    init.body = new FormData()
    native = toNativeFetchRequestInit(init)
    expect(hasFetchRequestInitHeader(native, 'content-type')).toBeFalsy()
    expect(native.body).toStrictEqual(init.body)

    init.body = new URLSearchParams()
    native = toNativeFetchRequestInit(init)
    expect(getFetchRequestInitHeader(native, 'content-type')).toBe('application/x-www-form-urlencoded')
    expect(native.body).toStrictEqual(init.body)

    inits = [{ body: 0n }, { body: false }, { body: noop }, { body: 0 }, { body: 'hello' }, { body: Symbol() }]
    for (let init of inits) {
      native = toNativeFetchRequestInit(init)
      expect(getFetchRequestInitHeader(native, 'content-type')).toBe('text/plain')
      expect(native.body).toStrictEqual(init.body.toString())
    }

    init.body = {}
    native = toNativeFetchRequestInit(init)
    expect(getFetchRequestInitHeader(native, 'content-type')).toBe('application/json')
    expect(native.body).toBe(JSON.stringify(init.body))
  })

  it('makes a request init easier to read in logs', () => {
    let loggable: FetchRequestInit<any>

    init.body = new FormData()
    init.body.append('name', 'john')

    loggable = toLoggableFetchRequestInit(init)
    expect(loggable.body).toStrictEqual({ name: 'john' })

    init.body = new URLSearchParams()
    init.body.set('name', 'john')

    loggable = toLoggableFetchRequestInit(init)
    expect(loggable.body).toStrictEqual({ name: 'john' })

    delete init.body
    expect(toLoggableFetchRequestInit(init)).toStrictEqual({})
  })

  it('makes a native request init easier to read in logs', () => {
    let loggable: RequestInit

    native.body = new FormData()
    native.body.append('name', 'john')

    loggable = toLoggableNativeFetchRequestInit(native)
    expect(loggable.body).toStrictEqual({ name: 'john' })

    init.body = new URLSearchParams()
    init.body.set('name', 'john')

    loggable = toLoggableNativeFetchRequestInit(init)
    expect(loggable.body).toStrictEqual({ name: 'john' })

    native.body = '{}'
    loggable = toLoggableNativeFetchRequestInit(native)
    expect(loggable.body).toStrictEqual({})

    native.body = 'hello'
    loggable = toLoggableNativeFetchRequestInit(native)
    expect(loggable.body).toBe(native.body)

    delete native.body
    expect(toLoggableNativeFetchRequestInit(native)).toStrictEqual({})
  })

  it('polyfills fetch', async () => {
    // @ts-ignore
    delete global.Blob
    // @ts-ignore
    delete global.fetch
    // @ts-ignore
    delete global.File
    // @ts-ignore
    delete global.FormData

    global.window = {} as any
    process.env.NODE_ENV = 'development'
    // delete process.env.JEST_WORKER_ID

    await useNodeFetch(await importNodeFetch())

    expect(global.Blob).toBeUndefined()
    expect(global.fetch).toBeUndefined()
    expect(global.File).toBeUndefined()
    expect(global.FormData).toBeUndefined()

    process.env.NODE_ENV = 'test'
    // process.env.JEST_WORKER_ID = ''

    await useNodeFetch(await importNodeFetch())

    expect(Blob).toBeDefined()
    expect(fetch).toBeDefined()
    expect(File).toBeDefined()
    expect(FormData).toBeDefined()

    await useNodeFetch(await importNodeFetch())
  })

  it('does not polyfill fetch if unable to import node-fetch', async () => {
    // @ts-ignore
    delete global.Blob
    // @ts-ignore
    delete global.fetch
    // @ts-ignore
    delete global.File
    // @ts-ignore
    delete global.FormData

    await useNodeFetch(new Error())

    expect(global.Blob).toBeUndefined()
    expect(global.fetch).toBeUndefined()
    expect(global.File).toBeUndefined()
    expect(global.FormData).toBeUndefined()
  })
})
