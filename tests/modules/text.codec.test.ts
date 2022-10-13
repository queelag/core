import { describe, expect, it } from 'vitest'
import { TextCodec } from '../../src'

describe('TextCodec', () => {
  it('decodes', () => {
    let input: string, encoded: Uint8Array

    input = 'hello'
    encoded = TextCodec.encode(input)

    expect(TextCodec.decode(encoded)).toBe(input)
  })

  it('encodes', () => {
    let input: string, encoded: Uint8Array

    input = 'hello'
    encoded = new Uint8Array([104, 101, 108, 108, 111])

    expect(TextCodec.encode(input)).toStrictEqual(encoded)
  })

  it('has working getters', () => {
    expect(TextCodec.isDecoderDefined).toBeTruthy()
    expect(TextCodec.isDecoderNotDefined).toBeFalsy()
    expect(TextCodec.isEncoderDefined).toBeTruthy()
    expect(TextCodec.isEncoderNotDefined).toBeFalsy()

    // @ts-ignore
    delete global.TextDecoder
    // @ts-ignore
    delete global.TextEncoder

    expect(TextCodec.isDecoderDefined).toBeFalsy()
    expect(TextCodec.isDecoderNotDefined).toBeTruthy()
    expect(TextCodec.isEncoderDefined).toBeFalsy()
    expect(TextCodec.isEncoderNotDefined).toBeTruthy()
  })
})
