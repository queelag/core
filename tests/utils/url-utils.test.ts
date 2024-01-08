import { beforeAll, describe, expect, it } from 'vitest'
import { appendSearchParamsToURL, concatURL, deserializeURLSearchParams, isURL, removeSearchParamsFromURL, serializeURLSearchParams } from '../../src'

describe('URL Utils', () => {
  let params: URLSearchParams

  beforeAll(() => {
    params = new URLSearchParams('a=0&b=1')
  })

  it('appends search params', () => {
    expect(appendSearchParamsToURL('http://localhost:3000', 'a=0')).toBe('http://localhost:3000/?a=0')
    expect(appendSearchParamsToURL('http://localhost:3000', '?a=0')).toBe('http://localhost:3000/?a=0')
    expect(appendSearchParamsToURL('http://localhost:3000?', 'a=0')).toBe('http://localhost:3000/?a=0')
    expect(appendSearchParamsToURL('http://localhost:3000?', '?a=0')).toBe('http://localhost:3000/?a=0')
    expect(appendSearchParamsToURL('http://localhost:3000?a=0', 'b=0')).toBe('http://localhost:3000/?a=0&b=0')
    expect(appendSearchParamsToURL('http://localhost:3000?a=0&', '?b=0')).toBe('http://localhost:3000/?a=0&b=0')
    expect(appendSearchParamsToURL('http://localhost:3000?a=0&', '&b=0')).toBe('http://localhost:3000/?a=0&b=0')
  })

  it('concatenates an URL', () => {
    expect(concatURL('http://localhost:3000', 'route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000', '/route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000', 'route/')).toBe('http://localhost:3000/route/')
    expect(concatURL('http://localhost:3000', '/route/')).toBe('http://localhost:3000/route/')
    expect(concatURL('http://localhost:3000/', 'route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000/', '/route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000/', 'route/')).toBe('http://localhost:3000/route/')
    expect(concatURL('http://localhost:3000/', '/route/')).toBe('http://localhost:3000/route/')

    expect(concatURL('http://localhost:3000', 'route', '1')).toBe('http://localhost:3000/1')
    expect(concatURL('http://localhost:3000', '/route', '1')).toBe('http://localhost:3000/1')
    expect(concatURL('http://localhost:3000', '/route', '/1')).toBe('http://localhost:3000/1')
    expect(concatURL('http://localhost:3000', '/route', '1/')).toBe('http://localhost:3000/1/')
    expect(concatURL('http://localhost:3000', '/route', '/1/')).toBe('http://localhost:3000/1/')
    expect(concatURL('http://localhost:3000', 'route/', '1')).toBe('http://localhost:3000/route/1')
    expect(concatURL('http://localhost:3000', 'route/', '/1')).toBe('http://localhost:3000/1')
    expect(concatURL('http://localhost:3000', 'route/', '1/')).toBe('http://localhost:3000/route/1/')
    expect(concatURL('http://localhost:3000', 'route/', '/1/')).toBe('http://localhost:3000/1/')
    expect(concatURL('http://localhost:3000', '/route/', '1')).toBe('http://localhost:3000/route/1')
    expect(concatURL('http://localhost:3000', '/route/', '/1')).toBe('http://localhost:3000/1')
    expect(concatURL('http://localhost:3000', '/route/', '1/')).toBe('http://localhost:3000/route/1/')
    expect(concatURL('http://localhost:3000', '/route/', '/1/')).toBe('http://localhost:3000/1/')

    expect(concatURL('http://localhost:3000', '')).toBe('http://localhost:3000/')

    expect(concatURL('file:///route', 'index.html')).toBe('file:///index.html')
    expect(concatURL('file:///route/', 'index.html')).toBe('file:///route/index.html')

    expect(concatURL('/', 'route')).toBe('/route')
    expect(concatURL('/', '/route')).toBe('/route')
    expect(concatURL('/', 'route/')).toBe('/route/')
    expect(concatURL('/', '/route/')).toBe('/route/')

    expect(concatURL('/', 'route', '1')).toBe('/route/1')
    expect(concatURL('/', '/route', '1')).toBe('/route/1')
    expect(concatURL('/', '/route', '/1')).toBe('/route/1')
    expect(concatURL('/', '/route', '/1/')).toBe('/route/1/')
    expect(concatURL('/', 'route/', '1')).toBe('/route/1')
    expect(concatURL('/', 'route/', '/1')).toBe('/route/1')
    expect(concatURL('/', 'route/', '1/')).toBe('/route/1/')
    expect(concatURL('/', 'route/', '/1/')).toBe('/route/1/')
    expect(concatURL('/', '/route/', '1')).toBe('/route/1')
    expect(concatURL('/', '/route/', '/1')).toBe('/route/1')
    expect(concatURL('/', '/route/', '1/')).toBe('/route/1/')
    expect(concatURL('/', '/route/', '/1/')).toBe('/route/1/')
  })

  it('deserializes search params', () => {
    expect(deserializeURLSearchParams(params)).toStrictEqual({ a: '0', b: '1' })
    expect(deserializeURLSearchParams(params, 'array')).toStrictEqual([
      ['a', '0'],
      ['b', '1']
    ])
    expect(deserializeURLSearchParams(params, 'object')).toStrictEqual({ a: '0', b: '1' })
    expect(deserializeURLSearchParams(params, 'string')).toBe('a=0&b=1')
  })

  it('removes search params', () => {
    expect(removeSearchParamsFromURL('http://localhost:3000')).toBe('http://localhost:3000/')
    expect(removeSearchParamsFromURL('http://localhost:3000?')).toBe('http://localhost:3000/')
    expect(removeSearchParamsFromURL('http://localhost:3000?a')).toBe('http://localhost:3000/')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=')).toBe('http://localhost:3000/')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0')).toBe('http://localhost:3000/')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0&')).toBe('http://localhost:3000/')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0&b')).toBe('http://localhost:3000/')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0&b=')).toBe('http://localhost:3000/')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0&b=0')).toBe('http://localhost:3000/')
  })

  it('serializes search params', () => {
    expect(
      serializeURLSearchParams([
        ['a', '0'],
        ['b', '1']
      ]).toString()
    ).toBe('a=0&b=1')
    expect(serializeURLSearchParams({ a: 0, b: 1 }).toString()).toBe('a=0&b=1')
    expect(serializeURLSearchParams('a=0&b=1').toString()).toBe('a=0&b=1')

    expect(
      serializeURLSearchParams([
        ['a', '0'],
        ['b', '1']
      ]).get('a')
    ).toBe('0')
    expect(
      serializeURLSearchParams([
        ['a', '0'],
        ['b', '1']
      ]).get('b')
    ).toBe('1')

    expect(serializeURLSearchParams({ a: 0, b: 1 }).get('a')).toBe('0')
    expect(serializeURLSearchParams({ a: 0, b: 1 }).get('b')).toBe('1')

    expect(serializeURLSearchParams('a=0&b=1').get('a')).toBe('0')
    expect(serializeURLSearchParams('a=0&b=1').get('b')).toBe('1')

    expect(serializeURLSearchParams({ a: [0, 1] }).get('a')).toBe('0,1')
  })

  it('checks if an unknown value is a URL', () => {
    expect(isURL('/')).toBe(false)
    expect(isURL('/', 'http://localhost:3000')).toBe(true)
    expect(isURL('http://localhost:3000')).toBe(true)
    expect(isURL(new URL('http://localhost:3000'))).toBe(true)
  })
})
