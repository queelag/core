import { randomBytes } from 'crypto'
import { describe, expect, it } from 'vitest'
import { decodeBase64, decodeBase64URL, encodeBase64, encodeBase64URL } from '../../src'

describe('Base64 Utils', () => {
  it('decodes', () => {
    let array: Uint8Array, encoded: string

    array = new Uint8Array(randomBytes(8))
    encoded = encodeBase64(array)

    expect(decodeBase64(encoded)).toStrictEqual(array)
  })

  it('encodes', () => {
    let string: string, decoded: Uint8Array

    string = 'bLPdkXDj4mA='
    decoded = decodeBase64(string)

    expect(encodeBase64(decoded)).toBe(string)
  })

  it('decodes URL', () => {
    let array: Uint8Array, encoded: string

    array = new Uint8Array(randomBytes(8))
    encoded = encodeBase64URL(array)

    console.log(encoded)

    expect(decodeBase64URL(encoded)).toStrictEqual(array)
  })

  it('encodes URL', () => {
    let string: string, decoded: Uint8Array

    string = 'aY2CONoD41w='
    decoded = decodeBase64URL(string)

    expect(encodeBase64URL(decoded)).toBe(string)
  })
})
