import { AracnaFileJSON } from '../definitions/interfaces.js'
import { StubFile } from '../definitions/stubs.js'
import { AracnaBlob } from './aracna-blob.js'
import { Environment } from './environment.js'

export class AracnaFile extends AracnaBlob {
  readonly file: File

  constructor(file: File)
  constructor(json: AracnaFileJSON)
  constructor(...args: any[]) {
    super(args[0])

    let file: File, json: AracnaFileJSON

    file = args[0]
    json = args[0]

    if (Environment.isFileNotDefined || args[0] instanceof File) {
      this.file = file

      return
    }

    this.file = new File([this.blob], json.name, { type: json.type })
  }

  toJSON(): AracnaFileJSON {
    return {
      ...super.toJSON(),
      lastModified: this.lastModified,
      name: this.name,
      webkitRelativePath: this.webkitRelativePath
    }
  }

  get lastModified(): number {
    return this.file.lastModified
  }

  get lastModifiedDate(): Date {
    return new Date(this.file.lastModified)
  }

  get name(): string {
    return this.file.name
  }

  get webkitRelativePath(): string {
    return this.file.webkitRelativePath
  }

  static get EMPTY(): AracnaFile {
    if (Environment.isFileNotDefined) {
      return new AracnaFile(new StubFile([], '') as File)
    }

    return new AracnaFile(new File([], ''))
  }
}
