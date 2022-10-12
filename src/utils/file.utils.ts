import { QueelagFile } from '../classes/queelag.file'
import { DeserializeFileOptions } from '../definitions/interfaces'

export async function deserializeFile(file: File, options?: DeserializeFileOptions): Promise<QueelagFile> {
  let item: QueelagFile = new QueelagFile(file)

  if (options?.resolveArrayBuffer) {
    await item.resolveArrayBuffer()
  }

  if (options?.resolveText) {
    await item.resolveText()
  }

  return item
}

export function serializeFile(file: QueelagFile, endings?: EndingType): File {
  return new File([file.file], file.name, { endings, lastModified: file.lastModified, type: file.type })
}
