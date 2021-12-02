import { ClassLogger } from '../loggers/class.logger'
import { Environment } from '../modules/environment'
import { tcp } from '../modules/tcp'

/**
 * Use node-fetch on node environments.
 */
if (Environment.isWindowNotDefined) {
  const Blob = Environment.require('fetch-blob')
  const fetch = Environment.require('node-fetch')

  global.fetch = fetch
  global.Blob = Blob
  global.Headers = fetch.Headers
  global.Request = fetch.Request
  global.Response = fetch.Response
}

/**
 * A class which extends the default Response one, it includes a parse method.
 *
 * @category Class
 */
export class FetchResponse<T = void> extends Response {
  // @ts-ignore
  data: T

  constructor(response: Response) {
    super(response.body, response)
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

        blob = await tcp(() => this.blob())
        if (blob instanceof Error) return

        this.data = blob as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as Blob.`, this.data)

        break
      case type.startsWith('application/json'):
        let json: object | Error

        json = await tcp(() => this.json())
        if (json instanceof Error) return

        this.data = json as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as JSON.`, this.data)

        break
      case Environment.isWindowDefined && type.startsWith('multipart/form-data'):
        let form: FormData | Error

        form = await tcp(() => this.formData())
        if (form instanceof Error) return

        this.data = form as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as FormData.`, this.data)

        break
      case type.startsWith('text/'):
        let text: string | Error

        text = await tcp(() => this.text())
        if (text instanceof Error) return

        this.data = text as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as text.`, [this.data])

        break
      default:
        let buffer: ArrayBuffer | Error

        buffer = await tcp(() => this.arrayBuffer())
        if (buffer instanceof Error) return

        this.data = buffer as any
        ClassLogger.debug('FetchResponse', 'parse', `The data has been parsed as ArrayBuffer.`, this.data)

        break
    }
  }
}
