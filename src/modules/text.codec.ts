import { STUB_TEXT_DECODER, STUB_TEXT_ENCODER } from '../definitions/constants'

interface Stub {
  decoder: TextDecoder
  encoder: TextEncoder
}

/**
 * A module to have both TextDecoder and TextEncoder already initialized.
 *
 * @category Module
 */
export class TextCodec {
  private static decoder: TextDecoder = typeof TextDecoder === 'function' ? new TextDecoder() : STUB_TEXT_DECODER
  private static encoder: TextEncoder = typeof TextEncoder === 'function' ? new TextEncoder() : STUB_TEXT_ENCODER

  static decode(input: Uint8Array, options?: TextDecodeOptions): string {
    return this.decoder.decode(input, options)
  }

  static encode(input: string): Uint8Array {
    return this.encoder.encode(input)
  }

  static get isDecoderDefined(): boolean {
    return typeof TextDecoder === 'function'
  }

  static get isDecoderNotDefined(): boolean {
    return typeof TextDecoder !== 'function'
  }

  static get isEncoderDefined(): boolean {
    return typeof TextEncoder === 'function'
  }

  static get isEncoderNotDefined(): boolean {
    return typeof TextEncoder !== 'function'
  }
}
