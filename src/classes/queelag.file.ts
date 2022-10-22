import { QueelagFileJSON } from '../definitions/interfaces'
import { QueelagBlob } from './queelag.blob'

export class QueelagFile extends QueelagBlob {
  readonly file: File

  constructor(file: File)
  constructor(json: QueelagFileJSON)
  constructor(...args: any[]) {
    super(args[0])

    let file: File, json: QueelagFileJSON

    file = args[0]
    json = args[0]

    if (args[0] instanceof File) {
      this.file = file

      return
    }

    this.file = new File([this.blob], json.name, { type: json.type })
  }

  toJSON(): QueelagFileJSON {
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

  static get EMPTY(): QueelagFile {
    return new QueelagFile(new File([], ''))
  }
}
