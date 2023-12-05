import { describe, expect, it } from 'vitest'
import { deserializeQueryParameters, serializeQueryParameters } from '../../src'

describe('Query Parameters Utils', () => {
  it('deserializes', () => {
    expect(deserializeQueryParameters('a=0&b=1')).toStrictEqual({ a: '0', b: '1' })
  })

  it('serializes', () => {
    expect(serializeQueryParameters({ a: 0, b: 1 })).toBe('a=0&b=1')
  })
})
