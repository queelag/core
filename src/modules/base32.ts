import { base32 } from 'rfc4648'

export class Base32 {
  static decode(string: string): Uint8Array {
    return base32.parse(string)
  }

  static encode(array: Uint8Array): string {
    return base32.stringify(array)
  }
}
