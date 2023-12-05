import { randomBytes } from 'crypto'
import { describe, expect, it } from 'vitest'
import { decodeBase16, encodeBase16 } from '../../src'

describe('Base16 Utils', () => {
  it('decodes', () => {
    let array: Uint8Array, encoded: string

    array = new Uint8Array(randomBytes(8))
    encoded = encodeBase16(array)

    expect(decodeBase16(encoded)).toStrictEqual(array)
  })

  it('encodes', () => {
    let string: string, decoded: Uint8Array

    string = 'F30988387B1FF230'
    decoded = decodeBase16(string)

    expect(encodeBase16(decoded)).toBe(string)
  })
})
