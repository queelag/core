import { describe, expect, it } from 'vitest'
import { decodeText, encodeText } from '../../src'
import { isTextDecoderDefined, isTextDecoderNotDefined, isTextEncoderDefined, isTextEncoderNotDefined } from '../../src/utils/environment-utils'

describe('Text Utils', () => {
  it('decodes', () => {
    let input: string, encoded: Uint8Array

    input = 'hello'
    encoded = encodeText(input)

    expect(decodeText(encoded)).toBe(input)
  })

  it('encodes', () => {
    let input: string, encoded: Uint8Array

    input = 'hello'
    encoded = new Uint8Array([104, 101, 108, 108, 111])

    expect(encodeText(input)).toStrictEqual(encoded)
  })

  it('has working getters', () => {
    expect(isTextDecoderDefined()).toBeTruthy()
    expect(isTextDecoderNotDefined()).toBeFalsy()
    expect(isTextEncoderDefined()).toBeTruthy()
    expect(isTextEncoderNotDefined()).toBeFalsy()

    // @ts-ignore
    delete global.TextDecoder
    // @ts-ignore
    delete global.TextEncoder

    expect(isTextDecoderDefined()).toBeFalsy()
    expect(isTextDecoderNotDefined()).toBeTruthy()
    expect(isTextEncoderDefined()).toBeFalsy()
    expect(isTextEncoderNotDefined()).toBeTruthy()
  })
})
