import { QueelagBlobJSON } from '../definitions/interfaces'
import { STUB_BLOB } from '../definitions/stubs'
import { tcp } from '../functions/tcp'
import { Base64 } from '../modules/base64'
import { Environment } from '../modules/environment'
import { ID } from '../modules/id'
import { TextCodec } from '../modules/text.codec'

export class QueelagBlob {
  private _arrayBuffer?: ArrayBuffer
  private _base64?: string
  readonly blob: Blob
  readonly id: string
  private _text?: string

  constructor(blob: Blob)
  constructor(json: QueelagBlobJSON)
  constructor(...args: any[]) {
    let blob: Blob, json: QueelagBlobJSON

    blob = args[0]
    json = args[0]

    if (typeof blob.arrayBuffer === 'function') {
      this.blob = blob
      this.id = ID.generate()

      return
    }

    this._arrayBuffer = new Uint8Array(Object.values(json.uInt8Array)).buffer
    this.blob = new Blob([this._arrayBuffer], { type: json.type })
    this.id = json.id
    this._text = json.text
  }

  async resolveArrayBuffer(): Promise<void> {
    let buffer: ArrayBuffer | Error

    buffer = await tcp(() => this.blob.arrayBuffer())
    if (buffer instanceof Error) return

    this._arrayBuffer = buffer
  }

  async resolveText(): Promise<void> {
    let text: string | Error

    text = await tcp(() => this.blob.text())
    if (text instanceof Error) return

    this._text = text
  }

  slice(start?: number, end?: number, contentType?: string): Blob {
    return this.blob.slice(start, end, contentType)
  }

  stream(): ReadableStream<Uint8Array>
  stream(): NodeJS.ReadableStream
  stream(): any {
    return this.blob.stream()
  }

  toJSON(): QueelagBlobJSON {
    return {
      id: this.id,
      size: this.size,
      text: this._text,
      type: this.type,
      uInt8Array: this.uInt8Array
    }
  }

  get arrayBuffer(): ArrayBuffer {
    return this._arrayBuffer || new ArrayBuffer(0)
  }

  get base64(): string {
    let base64: string

    if (this._base64) {
      return this._base64
    }

    base64 = Base64.encode(this.uInt8Array)
    this._base64 = base64

    return this._base64
  }

  get size(): number {
    return this.blob.size
  }

  get text(): string {
    return this._text || ''
  }

  get type(): string {
    return this.blob.type || 'application/octet-stream'
  }

  get uInt8Array(): Uint8Array {
    if (this._arrayBuffer) {
      return new Uint8Array(this._arrayBuffer)
    }

    if (this._text) {
      return TextCodec.encode(this._text)
    }

    return new Uint8Array()
  }

  static get EMPTY(): QueelagBlob {
    if (Environment.isBlobNotDefined) {
      return new QueelagBlob(new STUB_BLOB() as Blob)
    }

    return new QueelagBlob(new Blob())
  }
}
