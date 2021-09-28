export class TextCodec {
  private static decoder: TextDecoder = new TextDecoder()
  private static encoder: TextEncoder = new TextEncoder()

  static decode(input: Uint8Array, options?: TextDecodeOptions): string {
    return this.decoder.decode(input, options)
  }

  static encode(input: string): Uint8Array {
    return this.encoder.encode(input)
  }
}
