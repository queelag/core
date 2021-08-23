import { base64 } from 'rfc4648'

/**
 * A module to handle base64 decoding and encoding.
 */
export class Base64 {
  /**
   * Decodes a base64 string to an Uint8Array.
   */
  static decode(string: string): Uint8Array {
    return base64.parse(string)
  }

  /**
   * Encodes an array buffer to a base64 string.
   */
  static encode(buffer: ArrayBuffer): string {
    return base64.stringify(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer))
  }
}
