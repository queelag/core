import { AracnaBlob } from '../classes/aracna-blob.js'
import type { DeserializeBlobOptions } from '../definitions/interfaces.js'

/**
 * Deserializes a `Blob` object into an `AracnaBlob` instance.
 * Optionally resolves the data of the blob.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/blob)
 */
export async function deserializeBlob(blob: Blob, options?: DeserializeBlobOptions): Promise<AracnaBlob> {
  let item: AracnaBlob = new AracnaBlob(blob)

  if (options?.resolveArrayBuffer) {
    await item.resolveArrayBuffer()
  }

  if (options?.resolveText) {
    await item.resolveText()
  }

  return item
}

/**
 * Serializes an `AracnaBlob` instance into a `Blob` object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/blob)
 */
export function serializeBlob(blob: AracnaBlob, endings?: EndingType): Blob {
  return new Blob([blob.blob], { endings, type: blob.type })
}
