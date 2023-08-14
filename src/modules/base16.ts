import { base16 } from 'rfc4648'

export class Base16 {
  static decode(string: string): Uint8Array {
    return base16.parse(string)
  }

  static encode(array: Uint8Array): string {
    return base16.stringify(array)
  }
}
