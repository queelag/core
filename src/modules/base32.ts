import { base32 } from 'rfc4648'

/**
 * A module to handle base16 decoding and encoding.
 *
 * @category Module
 */
export class Base32 {
  /**
   * Decodes a base32 string to an Uint8Array.
   */
  static decode(string: string): Uint8Array {
    return base32.parse(string)
  }

  /**
   * Encodes an array buffer to a base32 string.
   */
  static encode(buffer: ArrayBuffer): string {
    return base32.stringify(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer))
  }
}
