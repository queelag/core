import { randomBytes } from 'crypto'
import { describe, expect, it } from 'vitest'
import { decodeBase32, decodeBase32Hex, encodeBase32, encodeBase32Hex } from '../../src'

describe('Base32 Utils', () => {
  it('decodes', () => {
    let array: Uint8Array, encoded: string

    array = new Uint8Array(randomBytes(8))
    encoded = encodeBase32(array)

    expect(decodeBase32(encoded)).toStrictEqual(array)
  })

  it('encodes', () => {
    let string: string, decoded: Uint8Array

    string = 'T3NMXR3JOY6AG==='
    decoded = decodeBase32(string)

    expect(encodeBase32(decoded)).toBe(string)
  })

  it('decodes hex', () => {
    let array: Uint8Array, encoded: string

    array = new Uint8Array(randomBytes(8))
    encoded = encodeBase32Hex(array)

    console.log(encoded)

    expect(decodeBase32Hex(encoded)).toStrictEqual(array)
  })

  it('encodes hex', () => {
    let string: string, decoded: Uint8Array

    string = '633V0IVMSS8Q6==='
    decoded = decodeBase32Hex(string)

    expect(encodeBase32Hex(decoded)).toBe(string)
  })
})
