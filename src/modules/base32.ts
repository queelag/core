import { base32 } from 'rfc4648'

/**
 * A module to handle base32 decoding and encoding.
 *
 * @category Module
 */
export class Base32 {
  /**
   * Decodes a base32 string to a Uint8Array.
   */
  static decode(string: string): Uint8Array {
    return base32.parse(string)
  }

  /**
   * Encodes a Uint8Array to a base32 string.
   */
  static encode(array: Uint8Array): string {
    return base32.stringify(array)
  }
}
