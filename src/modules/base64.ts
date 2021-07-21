import { base64 } from 'rfc4648'

export class Base64 {
  static decode(string: string): Uint8Array {
    return base64.parse(string)
  }

  static encode(buffer: ArrayBuffer): string {
    return base64.stringify(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer))
  }
}
