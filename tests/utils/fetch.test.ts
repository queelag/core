import {
  deleteFetchRequestInitHeader,
  FetchRequestInit,
  getFetchRequestInitHeader,
  getFetchRequestInitHeadersLength,
  hasFetchRequestInitHeader,
  mergeFetchRequestInits,
  setFetchRequestInitHeader,
  setFetchRequestInitHeaderWhenUnset
} from '../../src'

describe('FetchUtils', () => {
  let init: FetchRequestInit, inits: FetchRequestInit[]

  beforeEach(() => {
    init = {}
    inits = []
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
})
