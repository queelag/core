import { base32, base32hex } from 'rfc4648'
import { DecodeBase32HexOptions, DecodeBase32Options, EncodeBase32HexOptions, EncodeBase32Options } from '../definitions/interfaces.js'

export function decodeBase32(string: string, options?: DecodeBase32Options): Uint8Array {
  return base32.parse(string, options)
}

export function decodeBase32Hex(string: string, options?: DecodeBase32HexOptions): Uint8Array {
  return base32hex.parse(string, options)
}

export function encodeBase32(array: ArrayLike<number>, options?: EncodeBase32Options): string {
  return base32.stringify(array, options)
}

export function encodeBase32Hex(array: ArrayLike<number>, options?: EncodeBase32HexOptions): string {
  return base32hex.stringify(array, options)
}
