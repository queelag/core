import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { deserializeCookie, deserializeCookieValue, noop, serializeCookie, tne } from '../../src'
import { Configuration } from '../../src/classes/configuration'

describe('Cookie Utils', () => {
  beforeAll(() => {
    Configuration.functions.tc.log = false
  })

  afterAll(() => {
    Configuration.functions.tc.log = true
  })

  it('serializes unknown value correctly', () => {
    expect(serializeCookie('bigint', 1n)).toBe('bigint=1')
    expect(serializeCookie('boolean', true)).toBe('boolean=true')
    expect(serializeCookie('function', noop)).toBeInstanceOf(Error)
    expect(serializeCookie('number', 1)).toBe('number=1')
    expect(serializeCookie('string', 'value')).toBe('string=value')
    expect(serializeCookie('symbol', Symbol())).toBeInstanceOf(Error)
    expect(serializeCookie('undefined', undefined)).toBe('undefined=')

    expect(serializeCookie('array', [])).toBe(`array=${encodeURIComponent('[]')}`)
    expect(serializeCookie('object', { a: 0 })).toBe(`object=${encodeURIComponent('{"a":0}')}`)
    expect(serializeCookie('null', null)).toBe('null=')

    expect(serializeCookie('name', '')).toBe('name=')
    expect(serializeCookie('', 'value')).toBeInstanceOf(Error)
    expect(serializeCookie('', '')).toBeInstanceOf(Error)
  })

  it('deserializes from string correctly', () => {
    expect(deserializeCookie(`bigint=${BigInt(Number.MAX_SAFE_INTEGER + 1)}`)).toEqual({ bigint: BigInt(Number.MAX_SAFE_INTEGER + 1) })
    expect(deserializeCookie('boolean=true')).toEqual({ boolean: true })
    expect(deserializeCookie('number=1')).toEqual({ number: 1 })
    expect(deserializeCookie('string=value')).toEqual({ string: 'value' })
    expect(deserializeCookie('undefined=')).toEqual({ undefined: '' })

    expect(deserializeCookie('array=[]')).toEqual({ array: [] })
    expect(deserializeCookie(`object=${encodeURIComponent('{"a":0}')}`)).toEqual({ object: { a: 0 } })
    expect(deserializeCookie('null=')).toEqual({ null: '' })

    expect(deserializeCookie('name=')).toEqual({ name: '' })
    expect(deserializeCookie('=value')).toEqual({ '': 'value' })
    expect(deserializeCookie('=')).toEqual({})

    expect(
      deserializeCookie('name=value', {
        decode: () => {
          tne()
        }
      })
    ).toBeInstanceOf(Error)

    expect(deserializeCookieValue(undefined)).toBe(undefined)
  })
})
