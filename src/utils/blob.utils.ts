import { AracnaBlob } from '../classes/aracna.blob.js'
import { DeserializeBlobOptions } from '../definitions/interfaces.js'

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

export function serializeBlob(blob: AracnaBlob, endings?: EndingType): Blob {
  return new Blob([blob.blob], { endings, type: blob.type })
}
