import { tcp } from '../functions/tcp.js'
import { FetchResponseParseType } from '../index.js'
import { ClassLogger } from '../loggers/class-logger.js'

/**
 * The FetchResponse class is used for responses that are returned by the Fetch class.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/fetch-response)
 */
export class FetchResponse<T = unknown> implements Response {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/body) */
  readonly body: ReadableStream<Uint8Array> | null
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/bodyUsed) */
  readonly bodyUsed: boolean
  /**
   * The data that has been parsed.
   */
  data: T
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/headers) */
  readonly headers: Headers
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/ok) */
  readonly ok: boolean
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/redirected) */
  readonly redirected: boolean
  protected readonly response: Response
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/status) */
  readonly status: number
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/statusText) */
  readonly statusText: string
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/type) */
  readonly type: ResponseType
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/url) */
  readonly url: string

  constructor(response: Response, data?: T) {
    this.body = response.body
    this.bodyUsed = response.bodyUsed
    this.data = data as any
    this.headers = response.headers
    this.ok = response.ok
    this.redirected = response.redirected
    this.response = response
    this.status = response.status
    this.statusText = response.statusText
    this.type = response.type
    this.url = response.url
  }

  /**
   * Parses the body in the most appropriate way inferring the type from the content-type header.
   * Optionally the type can be specified, it can be array-buffer, blob, form-data, json, text or url-search-params.
   */
  async parse(type?: FetchResponseParseType): Promise<void> {
    switch (type) {
      case 'array-buffer':
        return this.parseArrayBuffer()
      case 'blob':
        return this.parseBlob()
      case 'form-data':
        return this.parseFormData()
      case 'json':
        return this.parseJSON()
      case 'text':
        return this.parseText()
      case 'url-search-params':
        return this.parseURLSearchParams()
    }

    switch (true) {
      case this.ContentType.startsWith('application/') && this.ContentType.includes('octet-stream'):
        return this.parseBlob()
      case this.ContentType.startsWith('application/') && this.ContentType.includes('json'):
        return this.parseJSON()
      case this.ContentType.startsWith('application/') && this.ContentType.includes('x-www-form-urlencoded'):
        return this.parseURLSearchParams()
      case this.ContentType.startsWith('multipart/') && this.ContentType.includes('form-data'):
        return this.parseFormData()
      case this.ContentType.startsWith('text/'):
        return this.parseText()
      default:
        return this.parseArrayBuffer()
    }
  }

  async parseArrayBuffer(): Promise<void> {
    let buffer: ArrayBuffer | Error

    buffer = await tcp(() => this.arrayBuffer())
    if (buffer instanceof Error) return this.setData(new ArrayBuffer(0))

    this.setData(buffer)
    ClassLogger.debug('FetchResponse', 'parseArrayBuffer', `The data has been parsed as ArrayBuffer.`, buffer)
  }

  async parseBlob(): Promise<void> {
    let blob: Blob | Error

    blob = await tcp(() => this.blob())
    if (blob instanceof Error) return this.setData(new Blob())

    this.setData(blob)
    ClassLogger.debug('FetchResponse', 'parseBlob', `The data has been parsed as Blob.`, blob)
  }

  async parseFormData(): Promise<void> {
    let form: FormData | Error

    form = await tcp(() => this.formData())
    if (form instanceof Error) return this.setData(new FormData())

    this.setData(form)
    ClassLogger.debug('FetchResponse', 'parseFormData', `The data has been parsed as FormData.`, [...form.entries()])
  }

  async parseJSON(): Promise<void> {
    let json: object | Error

    json = await tcp(() => this.json())
    if (json instanceof Error) return this.setData({})

    this.setData(json)
    ClassLogger.debug('FetchResponse', 'parseJSON', `The data has been parsed as JSON.`, json)
  }

  async parseText(): Promise<void> {
    let text: string | Error

    text = await tcp(() => this.text())
    if (text instanceof Error) return this.setData('')

    this.setData(text)
    ClassLogger.debug('FetchResponse', 'parseText', `The data has been parsed as text.`, [text])
  }

  async parseURLSearchParams(): Promise<void> {
    let params: string | Error

    params = await tcp(() => this.text())
    if (params instanceof Error) return this.setData(new URLSearchParams())

    this.setData(new URLSearchParams(params))
    ClassLogger.debug('FetchResponse', 'parseURLSearchParams', `The data has been parsed as URLSearchParams.`, new URLSearchParams(params))
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/arrayBuffer) */
  arrayBuffer(): Promise<ArrayBuffer> {
    return this.response.arrayBuffer()
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/blob) */
  blob(): Promise<Blob> {
    return this.response.blob()
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/clone) */
  clone(): Response {
    return this.response.clone()
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/formData) */
  formData(): Promise<FormData> {
    return this.response.formData()
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json) */
  json(): Promise<any> {
    return this.response.json()
  }

  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/text) */
  text(): Promise<string> {
    return this.response.text()
  }

  /**
   * Sets the data.
   */
  protected setData(data: any): void {
    this.data = data
  }

  /**
   * Creates a new FetchResponse instance.
   */
  static from<T>(data: T): FetchResponse<T>
  static from<T>(response: Response): FetchResponse<T>
  static from<T>(...args: any[]): FetchResponse<T> {
    if (args[0] instanceof Response) {
      return new FetchResponse(args[0])
    }

    return new FetchResponse(new Response(), args[0])
  }

  /**
   * Returns the content-type header.
   */
  protected get ContentType(): string {
    return this.headers.get('content-type') ?? ''
  }
}
