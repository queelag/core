import { randomBytes } from 'crypto'
import { Base64 } from '../../src'

describe('Base64', () => {
  it('decodes', () => {
    let array: Uint8Array, encoded: string

    array = new Uint8Array(randomBytes(8))
    encoded = Base64.encode(array)

    expect(Base64.decode(encoded)).toStrictEqual(array)
  })

  it('encodes', () => {
    let string: string, decoded: Uint8Array

    string = 'bLPdkXDj4mA='
    decoded = Base64.decode(string)

    expect(Base64.encode(decoded)).toBe(string)
  })
})
