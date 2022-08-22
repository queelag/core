import { base64 } from 'rfc4648'

/**
 * A module to handle base64 decoding and encoding.
 *
 * @category Module
 */
export class Base64 {
  /**
   * Decodes a base64 string to a Uint8Array.
   */
  static decode(string: string): Uint8Array {
    return base64.parse(string)
  }

  /**
   * Encodes a Uint8Array to a base64 string.
   */
  static encode(array: Uint8Array): string {
    return base64.stringify(array)
  }
}
