import { AracnaFile } from '../classes/aracna.file'
import { DeserializeFileOptions } from '../definitions/interfaces'

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

export function serializeFile(file: AracnaFile, endings?: EndingType): File {
  return new File([file.file], file.name, { endings, lastModified: file.lastModified, type: file.type })
}
