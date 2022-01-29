import { ModuleLogger } from '../loggers/module.logger'

interface Stub {
  decoder: TextDecoder
  encoder: TextEncoder
}

class _ {
  private decoder: TextDecoder
  private encoder: TextEncoder

  constructor() {
    this.decoder = this.isDecoderDefined ? new TextDecoder() : this.stub.decoder
    if (this.isDecoderNotDefined) {
      ModuleLogger.warn('TextCodec', 'constructor', `The TextDecoder is not defined, falling back to dummy implementation.`)
    }

    this.encoder = this.isEncoderDefined ? new TextEncoder() : this.stub.encoder
    if (this.isEncoderNotDefined) {
      ModuleLogger.warn('TextCodec', 'constructor', `The TextEncoder is not defined, falling back to dummy implementation.`)
    }
  }

  decode(input: Uint8Array, options?: TextDecodeOptions): string {
    return this.decoder.decode(input, options)
  }

  encode(input: string): Uint8Array {
    return this.encoder.encode(input)
  }

  get isDecoderDefined(): boolean {
    return typeof TextDecoder === 'function'
  }

  get isDecoderNotDefined(): boolean {
    return typeof TextDecoder !== 'function'
  }

  get isEncoderDefined(): boolean {
    return typeof TextEncoder === 'function'
  }

  get isEncoderNotDefined(): boolean {
    return typeof TextEncoder !== 'function'
  }

  private get stub(): Stub {
    return {
      decoder: {
        decode: () => '',
        encoding: '',
        fatal: false,
        ignoreBOM: false
      },
      encoder: {
        encode: () => new Uint8Array(),
        encodeInto: () => ({ read: 0, written: 0 }),
        encoding: ''
      }
    }
  }
}

/**
 * A module to have both TextDecoder and TextEncoder already initialized.
 *
 * @category Module
 */
export const TextCodec = new _()
