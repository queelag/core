import { base16 } from 'rfc4648'
import { DecodeBase16Options, EncodeBase16Options } from '../definitions/interfaces.js'

export function decodeBase16(string: string, options?: DecodeBase16Options): Uint8Array {
  return base16.parse(string, options)
}

export function encodeBase16(array: ArrayLike<number>, options?: EncodeBase16Options): string {
  return base16.stringify(array, options)
}
