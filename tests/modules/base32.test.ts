import { randomBytes } from 'crypto'
import { describe, expect, it } from 'vitest'
import { Base32 } from '../../src'

describe('Base32', () => {
  it('decodes', () => {
    let array: Uint8Array, encoded: string

    array = new Uint8Array(randomBytes(8))
    encoded = Base32.encode(array)

    expect(Base32.decode(encoded)).toStrictEqual(array)
  })

  it('encodes', () => {
    let string: string, decoded: Uint8Array

    string = 'T3NMXR3JOY6AG==='
    decoded = Base32.decode(string)

    expect(Base32.encode(decoded)).toBe(string)
  })
})
