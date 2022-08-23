import { randomBytes } from 'crypto'
import { Base16 } from '../../src'

describe('Base16', () => {
  it('decodes', () => {
    let array: Uint8Array, encoded: string

    array = new Uint8Array(randomBytes(8))
    encoded = Base16.encode(array)

    expect(Base16.decode(encoded)).toStrictEqual(array)
  })

  it('encodes', () => {
    let string: string, decoded: Uint8Array

    string = 'F30988387B1FF230'
    decoded = Base16.decode(string)

    expect(Base16.encode(decoded)).toBe(string)
  })
})
