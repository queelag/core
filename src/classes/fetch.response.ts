import { tcp } from '../functions/tcp'
import { ClassLogger } from '../loggers/class.logger'

/**
 * A class which extends the default Response one, it includes a parse method.
 *
 * @category Class
 */
export class FetchResponse<T = unknown> implements Response {
  readonly body: ReadableStream<Uint8Array> | null
  readonly bodyUsed: boolean
  data: T
  readonly headers: Headers
  readonly ok: boolean
  readonly redirected: boolean
  private readonly response: Response
  readonly status: number
  readonly statusText: string
  readonly type: ResponseType
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

  async parse(): Promise<void> {
    switch (true) {
      case this.ContentType.startsWith('application/') && this.ContentType.includes('octet-stream'):
        let blob: Blob | Error

        blob = await tcp(() => this.blob())
        if (blob instanceof Error) return this.setData(new Blob())

        this.setData(blob)
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as Blob.`, blob)

        break
      case this.ContentType.startsWith('application/') && this.ContentType.includes('json'):
        let json: object | Error

        json = await tcp(() => this.json())
        if (json instanceof Error) return this.setData({})

        this.setData(json)
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as JSON.`, json)

        break
      // istanbul ignore next
      case this.ContentType.startsWith('multipart/') && this.ContentType.includes('form-data'):
        let form: FormData | Error

        form = await tcp(() => this.formData())
        if (form instanceof Error) return this.setData(new FormData())

        this.setData(form)
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as FormData.`, [...form.entries()])

        break
      case this.ContentType.startsWith('text/'):
        let text: string | Error

        text = await tcp(() => this.text())
        if (text instanceof Error) return this.setData('')

        this.setData(text)
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as text.`, [text])

        break
      default:
        let buffer: ArrayBuffer | Error

        buffer = await tcp(() => this.arrayBuffer())
        if (buffer instanceof Error) return this.setData(new ArrayBuffer(0))

        this.setData(buffer)
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as ArrayBuffer.`, buffer)

        break
    }
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return this.response.arrayBuffer()
  }

  blob(): Promise<Blob> {
    return this.response.blob()
  }

  clone(): Response {
    return this.response.clone()
  }

  // istanbul ignore next
  formData(): Promise<FormData> {
    return this.response.formData()
  }

  json(): Promise<any> {
    return this.response.json()
  }

  text(): Promise<string> {
    return this.response.text()
  }

  private setData(data: any): void {
    this.data = data
  }

  static from<T>(data: T): FetchResponse<T>
  static from<T>(response: Response): FetchResponse<T>
  static from<T>(...args: any[]): FetchResponse<T> {
    if (args[0] instanceof Response) {
      return new FetchResponse(args[0])
    }

    return new FetchResponse(new Response(), args[0])
  }

  private get ContentType(): string {
    return this.headers.get('content-type') || ''
  }
}
