import { base64, base64url } from 'rfc4648'
import type { DecodeBase64Options, DecodeBase64URLOptions, EncodeBase64Options, EncodeBase64URLOptions } from '../definitions/interfaces.js'

/**
 * Decodes a base64 string into a Uint8Array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/base64)
 */
export function decodeBase64(string: string, options?: DecodeBase64Options): Uint8Array<ArrayBuffer> {
  return base64.parse(string, options) as Uint8Array<ArrayBuffer>
}

/**
 * Decodes a base64url string into a Uint8Array.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/base64)
 */
export function decodeBase64URL(string: string, options?: DecodeBase64URLOptions): Uint8Array<ArrayBuffer> {
  return base64url.parse(string, options) as Uint8Array<ArrayBuffer>
}

/**
 * Encodes an array of integers into a base64 string.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/base64)
 */
export function encodeBase64(array: ArrayLike<number>, options?: EncodeBase64Options): string {
  return base64.stringify(array, options)
}

/**
 * Encodes an array of integers into a base64url string.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/base64)
 */
export function encodeBase64URL(array: ArrayLike<number>, options?: EncodeBase64URLOptions): string {
  return base64url.stringify(array, options)
}
