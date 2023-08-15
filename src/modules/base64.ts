import { base64 } from 'rfc4648'

/**
 * @category Module
 */
export class Base64 {
  static decode(string: string): Uint8Array {
    return base64.parse(string)
  }

  static encode(array: Uint8Array): string {
    return base64.stringify(array)
  }
}
