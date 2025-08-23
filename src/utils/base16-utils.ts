import { base16 } from 'rfc4648'
import { DecodeBase16Options, EncodeBase16Options } from '../definitions/interfaces.js'

/**
 * Decodes a base16 string into a Uint8Array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/base16)
 */
export function decodeBase16(string: string, options?: DecodeBase16Options): Uint8Array<ArrayBuffer> {
  return base16.parse(string, options) as Uint8Array<ArrayBuffer>
}

/**
 * Encodes an array of integers into a base16 string.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/base16)
 */
export function encodeBase16(array: ArrayLike<number>, options?: EncodeBase16Options): string {
  return base16.stringify(array, options)
}
