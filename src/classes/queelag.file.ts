import { QueelagBlob } from './queelag.blob'

export class QueelagFile extends QueelagBlob {
  readonly file: File

  constructor(file: File) {
    super(file)
    this.file = file
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
