import { STUB_TEXT_DECODER, STUB_TEXT_ENCODER } from '../definitions/stubs.js'
import { isTextDecoderDefined, isTextEncoderDefined } from './environment-utils.js'

/**
 * Decodes a buffer into a string.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/text)
 */
export function decodeText(input: AllowSharedBufferSource, options?: TextDecodeOptions): string {
  return getTextDecoder().decode(input, options)
}

/**
 * Encodes a string into a Uint8Array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/text)
 */
export function encodeText(input: string): Uint8Array {
  return getTextEncoder().encode(input)
}

/**
 * Returns a new TextDecoder or a stub if the environment does not support it.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/text)
 */
export function getTextDecoder(): TextDecoder {
  return isTextDecoderDefined() ? new TextDecoder() : STUB_TEXT_DECODER
}

/**
 * Returns a new TextEncoder or a stub if the environment does not support it.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/text)
 */
export function getTextEncoder(): TextEncoder {
  return isTextEncoderDefined() ? new TextEncoder() : STUB_TEXT_ENCODER
}
