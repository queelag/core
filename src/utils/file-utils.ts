import { AracnaFile } from '../classes/aracna-file.js'
import type { DeserializeFileOptions } from '../definitions/interfaces.js'

/**
 * Deserializes a `File` object into an `AracnaFile` instance.
 * Optionally resolves the data of the file.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/file)
 */
export async function deserializeFile(file: File, options?: DeserializeFileOptions): Promise<AracnaFile> {
  let item: AracnaFile = new AracnaFile(file)

  if (options?.resolveArrayBuffer) {
    await item.resolveArrayBuffer()
  }

  if (options?.resolveText) {
    await item.resolveText()
  }

  return item
}

/**
 * Serializes an `AracnaFile` instance into a `File` object.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/file)
 */
export function serializeFile(file: AracnaFile, endings?: EndingType): File {
  return new File([file.file], file.name, { endings, lastModified: file.lastModified, type: file.type })
}
