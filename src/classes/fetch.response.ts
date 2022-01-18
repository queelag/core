import { ClassLogger } from '../loggers/class.logger'
import { Environment } from '../modules/environment'
import { noop } from '../modules/noop'
import { tcp } from '../modules/tcp'

/**
 * A class which extends the default Response one, it includes a parse method.
 *
 * @category Class
 */
export class FetchResponse<T = void> implements Response {
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

  constructor(response: Response) {
    this.body = response.body
    this.bodyUsed = response.bodyUsed
    this.data = undefined as any
    this.headers = response.headers
    this.ok = response.ok
    this.redirected = response.redirected
    this.response = response
    this.status = response.status
    this.statusText = response.statusText
    this.type = response.type
    this.url = response.type

    this.arrayBuffer = response.arrayBuffer
    this.blob = response.blob
    this.clone = response.clone
    this.formData = response.formData
    this.json = response.json
    this.text = response.text
  }

  async parse(): Promise<void | Error> {
    let type: string

    if (this.body === null) {
      ClassLogger.warn('FetchResponse', 'parse', `The body is null.`, this.body)
      return
    }

    type = this.headers.get('content-type') || ''
    if (!type) ClassLogger.warn('FetchResponse', 'parse', `The content-type header is not defined.`, this.headers)

    switch (true) {
      case Environment.isBlobDefined && type.startsWith('application/') && type.includes('octet-stream'):
        let blob: Blob | Error

        blob = await tcp(() => this.response.blob())
        if (blob instanceof Error) return blob

        this.data = blob as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as Blob.`, blob)

        break
      case type.startsWith('application/') && type.includes('json'):
        let json: object | Error

        json = await tcp(() => this.response.json())
        if (json instanceof Error) return json

        this.data = json as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as JSON.`, json)

        break
      case Environment.isFormDataDefined && type.startsWith('multipart/') && type.includes('form-data'):
        let form: FormData | Error

        form = await tcp(() => this.response.formData())
        if (form instanceof Error) return form

        this.data = form as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as FormData.`, [...form.entries()])

        break
      case type.startsWith('text/'):
        let text: string | Error

        text = await tcp(() => this.response.text())
        if (text instanceof Error) return text

        this.data = text as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as text.`, [text])

        break
      default:
        let buffer: ArrayBuffer | Error

        buffer = await tcp(() => this.response.arrayBuffer())
        if (buffer instanceof Error) return buffer

        this.data = buffer as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as ArrayBuffer.`, buffer)

        break
    }
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return noop()
  }

  blob(): Promise<Blob> {
    return noop()
  }

  clone(): Response {
    return noop()
  }

  formData(): Promise<FormData> {
    return noop()
  }

  json(): Promise<any> {
    return noop()
  }

  text(): Promise<string> {
    return noop()
  }
}
