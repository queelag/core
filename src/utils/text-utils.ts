import { STUB_TEXT_DECODER, STUB_TEXT_ENCODER } from '../definitions/stubs.js'
import { isTextDecoderDefined, isTextEncoderDefined } from './environment-utils.js'

export function decodeText(input: AllowSharedBufferSource, options?: TextDecodeOptions): string {
  return getTextDecoder().decode(input, options)
}

export function encodeText(input: string): Uint8Array {
  return getTextEncoder().encode(input)
}

export function getTextDecoder(): TextDecoder {
  return isTextDecoderDefined() ? new TextDecoder() : STUB_TEXT_DECODER
}

export function getTextEncoder(): TextEncoder {
  return isTextEncoderDefined() ? new TextEncoder() : STUB_TEXT_ENCODER
}
