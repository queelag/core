import { deserializeQueryParameters, serializeQueryParameters } from '../../src'

describe('QueryParametersUtils', () => {
  it('deserializes', () => {
    expect(deserializeQueryParameters('a=0&b=1')).toStrictEqual({ a: '0', b: '1' })
  })

  it('serializes', () => {
    expect(serializeQueryParameters({ a: 0, b: 1 })).toBe('a=0&b=1')
  })
})
