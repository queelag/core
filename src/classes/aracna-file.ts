import { AracnaFileJSON } from '../definitions/interfaces.js'
import { StubFile } from '../definitions/stubs.js'
import { isFileNotDefined } from '../utils/environment-utils.js'
import { AracnaBlob } from './aracna-blob.js'

/**
 * The AracnaFile class extends the AracnaBlob class and is built on top of the File class.
 * The data contained in the File can be resolved asynchronously and accessed at a later time from the instance itself.
 * The instance supports JSON serialization and deserialization out of the box unlike the File class.
 */
export class AracnaFile extends AracnaBlob {
  /**
   * The File instance.
   */
  readonly file: File

  constructor(file: File)
  constructor(json: AracnaFileJSON)
  constructor(...args: any[]) {
    super(args[0])

    let file: File, json: AracnaFileJSON

    file = args[0]
    json = args[0]

    if (isFileNotDefined() || args[0] instanceof File) {
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

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/File/lastModified) */
  get lastModified(): number {
    return this.file.lastModified
  }

  /**
   * Returns the last modified date of the file.
   */
  get lastModifiedDate(): Date {
    return new Date(this.file.lastModified)
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/File/name) */
  get name(): string {
    return this.file.name
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/File/webkitRelativePath) */
  get webkitRelativePath(): string {
    return this.file.webkitRelativePath
  }

  /**
   * Returns an empty AracnaFile instance.
   */
  static get EMPTY(): AracnaFile {
    if (isFileNotDefined()) {
      return new AracnaFile(new StubFile([], '') as File)
    }

    return new AracnaFile(new File([], ''))
  }
}
