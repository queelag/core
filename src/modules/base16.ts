import { base16 } from 'rfc4648'

/**
 * A module to handle base16 decoding and encoding.
 *
 * @category Module
 */
export class Base16 {
  /**
   * Decodes a base16 string to an Uint8Array.
   */
  static decode(string: string): Uint8Array {
    return base16.parse(string)
  }

  /**
   * Encodes an array buffer to a base16 string.
   */
  static encode(buffer: ArrayBuffer): string {
    return base16.stringify(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer))
  }
}
