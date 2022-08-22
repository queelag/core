import { base16 } from 'rfc4648'

/**
 * A module to handle base16 decoding and encoding.
 *
 * @category Module
 */
export class Base16 {
  /**
   * Decodes a base16 string to a Uint8Array.
   */
  static decode(string: string): Uint8Array {
    return base16.parse(string)
  }

  /**
   * Encodes a Uint8Array to a base16 string.
   */
  static encode(array: Uint8Array): string {
    return base16.stringify(array)
  }
}
