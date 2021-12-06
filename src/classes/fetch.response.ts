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

  async parse(): Promise<void> {
    let type: string | null

    if (this.body === null) {
      ClassLogger.warn('FetchResponse', 'parse', `The body is null.`, this.body)
      return
    }

    type = this.headers.get('response-type') || this.headers.get('content-type')
    if (!type) {
      ClassLogger.warn('FetchResponse', 'parse', `The content type and response type header are not defined.`, [...this.headers.entries()])
      return
    }

    switch (true) {
      case type.startsWith('application/octet-stream'):
        let blob: Blob | Error

        blob = await tcp(() => this.response.blob())
        if (blob instanceof Error) return

        this.data = blob as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as Blob.`, this.data)

        break
      case type.startsWith('application/json'):
        let json: object | Error

        json = await tcp(() => this.response.json())
        if (json instanceof Error) return

        this.data = json as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as JSON.`, this.data)

        break
      case Environment.isWindowDefined && type.startsWith('multipart/form-data'):
        let form: FormData | Error

        form = await tcp(() => this.response.formData())
        if (form instanceof Error) return

        this.data = form as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as FormData.`, this.data)

        break
      case type.startsWith('text/'):
        let text: string | Error

        text = await tcp(() => this.response.text())
        if (text instanceof Error) return

        this.data = text as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as text.`, [this.data])

        break
      default:
        let buffer: ArrayBuffer | Error

        buffer = await tcp(() => this.response.arrayBuffer())
        if (buffer instanceof Error) return

        this.data = buffer as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as ArrayBuffer.`, this.data)

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
