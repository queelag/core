import { Logger } from '../modules/logger'

export class FetchResponse<T = void> extends Response {
  // @ts-ignore
  data: T

  constructor(response: Response) {
    super(response.body, response)
  }

  async parse(): Promise<void> {
    let type: string | null

    if (this.body === null) {
      Logger.warn('FetchResponse', 'parse', `The body is null.`, this.body)
      return
    }

    type = this.headers.get('response-type') || this.headers.get('content-type')
    if (!type) {
      Logger.warn('FetchResponse', 'parse', `The content type and response type header are not defined.`, [...this.headers.entries()])
      return
    }

    switch (true) {
      case type.startsWith('application/octet-stream'):
        this.data = (await this.blob()) as any
        Logger.debug('FetchResponse', 'parse', `The data has been parsed as Blob.`, this.data)

        break
      case type.startsWith('application/json'):
        this.data = await this.json()
        Logger.debug('FetchResponse', 'parse', `The data has been parsed as JSON.`, this.data)

        break
      case type.startsWith('multipart/form-data'):
        this.data = (await this.formData()) as any
        Logger.debug('FetchResponse', 'parse', `The data has been parsed as FormData.`, this.data)

        break
      case type.startsWith('text/'):
        this.data = (await this.text()) as any
        Logger.debug('FetchResponse', 'parse', `The data has been parsed as text.`, [this.data])

        break
      default:
        this.data = (await this.arrayBuffer()) as any
        Logger.debug('FetchResponse', 'parse', `The data has been parsed as ArrayBuffer.`, this.data)

        break
    }
  }
}
