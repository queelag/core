import { base64, base64url } from 'rfc4648'
import { DecodeBase64Options, DecodeBase64URLOptions, EncodeBase64Options, EncodeBase64URLOptions } from '../definitions/interfaces.js'

export function decodeBase64(string: string, options?: DecodeBase64Options): Uint8Array {
  return base64.parse(string, options)
}

export function decodeBase64URL(string: string, options?: DecodeBase64URLOptions): Uint8Array {
  return base64url.parse(string, options)
}

export function encodeBase64(array: ArrayLike<number>, options?: EncodeBase64Options): string {
  return base64.stringify(array, options)
}

export function encodeBase64URL(array: ArrayLike<number>, options?: EncodeBase64URLOptions): string {
  return base64url.stringify(array, options)
}
