import { tcp } from '../functions/tcp'
import { Base64 } from '../modules/base64'
import { ID } from '../modules/id'

export class QueelagBlob {
  private _arrayBuffer?: ArrayBuffer
  private _base64?: string
  readonly blob: Blob
  readonly id: string
  private _text?: string

  constructor(blob: Blob) {
    this.blob = blob
    this.id = ID.generate()
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
    return new Uint8Array(this.arrayBuffer)
  }

  static get EMPTY(): QueelagBlob {
    return new QueelagBlob(new Blob())
  }
}
