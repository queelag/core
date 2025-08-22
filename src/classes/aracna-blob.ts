import { AracnaBlobJSON } from '../definitions/interfaces.js'
import { StubBlob } from '../definitions/stubs.js'
import { tcp } from '../functions/tcp.js'
import { isBlobNotDefined } from '../utils/environment-utils.js'
import { generateRandomString } from '../utils/string-utils.js'
import { decodeText, encodeText } from '../utils/text-utils.js'

/**
 * The AracnaBlob class is built on top of the Blob class.
 *
 * - The data contained in the Blob can be resolved asynchronously and accessed at a later time from the instance itself.
 * - The instance supports JSON serialization and deserialization out of the box unlike the Blob class.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/aracna-blob)
 */
export class AracnaBlob {
  protected _arrayBuffer?: ArrayBuffer
  /**
   * The Blob instance.
   */
  readonly blob: Blob
  /**
   * The unique identifier of the instance.
   */
  readonly id: string
  protected _text?: string

  constructor(blob: Blob)
  constructor(json: AracnaBlobJSON)
  constructor(...args: any[]) {
    let blob: Blob, json: AracnaBlobJSON

    blob = args[0]
    json = args[0]

    if (isBlobNotDefined() || blob instanceof Blob) {
      this.blob = blob
      this.id = generateRandomString()

      return
    }

    this._arrayBuffer = new Uint8Array(Object.values(json.uInt8Array)).buffer
    this.blob = new Blob([this._arrayBuffer], { type: json.type })
    this.id = json.id
    this._text = decodeText(new Uint8Array(Object.values(json.uInt8Array)))
  }

  /**
   * Resolves the data contained in the Blob as an ArrayBuffer.
   */
  async resolveArrayBuffer(): Promise<void> {
    let buffer: ArrayBuffer | Error

    buffer = await tcp(() => this.blob.arrayBuffer())
    if (buffer instanceof Error) return

    this._arrayBuffer = buffer
  }

  /**
   * Resolves the data contained in the Blob as a string.
   */
  async resolveText(): Promise<void> {
    let text: string | Error

    text = await tcp(() => this.blob.text())
    if (text instanceof Error) return

    this._text = text
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/slice) */
  slice(start?: number, end?: number, contentType?: string): Blob {
    return this.blob.slice(start, end, contentType)
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/stream) */
  stream(): ReadableStream<Uint8Array<ArrayBuffer>>
  stream(): NodeJS.ReadableStream
  stream(): any {
    return this.blob.stream()
  }

  /**
   * Serializes the instance into a JSON object.
   */
  toJSON(): AracnaBlobJSON {
    return {
      id: this.id,
      size: this.size,
      type: this.type,
      uInt8Array: this.uInt8Array
    }
  }

  /**
   * Returns the data contained in the Blob as an ArrayBuffer.
   * You need to call the "resolveArrayBuffer" method before accessing this property.
   */
  get arrayBuffer(): ArrayBuffer {
    return this._arrayBuffer ?? new ArrayBuffer(0)
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/size) */
  get size(): number {
    return this.blob.size
  }

  /**
   * Returns the data contained in the Blob as a string.
   * You need to call the "resolveText" method before accessing this property.
   */
  get text(): string {
    return this._text ?? ''
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Blob/type) */
  get type(): string {
    return this.blob.type || 'application/octet-stream'
  }

  /**
   * Returns the data contained in the Blob as a Uint8Array.
   * You need to call the "resolveArrayBuffer" or "resolveText" method before accessing this property.
   */
  get uInt8Array(): Uint8Array<ArrayBuffer> {
    if (this._arrayBuffer) {
      return new Uint8Array(this._arrayBuffer)
    }

    if (this._text) {
      return encodeText(this._text)
    }

    return new Uint8Array()
  }

  /**
   * Returns an empty AracnaBlob instance.
   */
  static get EMPTY(): AracnaBlob {
    if (isBlobNotDefined()) {
      return new AracnaBlob(new StubBlob() as Blob)
    }

    return new AracnaBlob(new Blob())
  }
}
