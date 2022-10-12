import { QueelagBlob } from '../classes/queelag.blob'
import { DeserializeBlobOptions } from '../definitions/interfaces'

export async function deserializeBlob(blob: Blob, options?: DeserializeBlobOptions): Promise<QueelagBlob> {
  let item: QueelagBlob = new QueelagBlob(blob)

  if (options?.resolveArrayBuffer) {
    await item.resolveArrayBuffer()
  }

  if (options?.resolveText) {
    await item.resolveText()
  }

  return item
}

export function serializeBlob(blob: QueelagBlob, endings?: EndingType): Blob {
  return new Blob([blob.blob], { endings, type: blob.type })
}
