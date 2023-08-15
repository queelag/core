import { STUB_TEXT_DECODER, STUB_TEXT_ENCODER } from '../definitions/stubs.js'

/**
 * @category Module
 */
export class TextCodec {
  // istanbul ignore next
  private static decoder: TextDecoder = typeof TextDecoder === 'function' ? new TextDecoder() : STUB_TEXT_DECODER
  // istanbul ignore next
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
