import { beforeAll, describe, expect, it } from 'vitest'
import { deserializeURLSearchParams, serializeURLSearchParams } from '../../src'

describe('Query Parameters Utils', () => {
  let params: URLSearchParams

  beforeAll(() => {
    params = new URLSearchParams('a=0&b=1')
  })

  it('deserializes', () => {
    expect(deserializeURLSearchParams(params)).toStrictEqual({ a: '0', b: '1' })
    expect(deserializeURLSearchParams(params, 'array')).toStrictEqual([
      ['a', '0'],
      ['b', '1']
    ])
    expect(deserializeURLSearchParams(params, 'object')).toStrictEqual({ a: '0', b: '1' })
    expect(deserializeURLSearchParams(params, 'string')).toBe('a=0&b=1')
  })

  it('serializes', () => {
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
  })
})
