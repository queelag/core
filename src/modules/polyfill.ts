import { ModuleLogger } from '../loggers/module.logger'
import { Environment } from './environment'
import { tcp } from './tcp'

type PolyfillName = 'blob' | 'fetch' | 'file' | 'formData'

/**
 * A module to inject requirable polyfills.
 *
 * @category Module
 */
export class Polyfill {
  /**
   * Polyfills the Blob object.
   */
  static async blob(): Promise<void> {
    let NodeFetch: any | Error

    if (Environment.isFetchDefined) {
      return
    }

    NodeFetch = await tcp(() => Environment.import('node-fetch'))
    if (NodeFetch instanceof Error) return

    global.Blob = (await new NodeFetch.Response().blob()).constructor

    ModuleLogger.debug('Polyfill', 'blob', `The Blob object has been polyfilled with node-fetch.`)
  }

  /**
   * Polyfills the Fetch API.
   */
  static async fetch(): Promise<void> {
    let NodeFetch: any | Error

    if (Environment.isFetchDefined) {
      return
    }

    NodeFetch = await tcp(() => Environment.import('node-fetch'))
    if (NodeFetch instanceof Error) return

    global.fetch = NodeFetch.default
    global.Headers = NodeFetch.Headers
    global.Request = NodeFetch.Request
    global.Response = NodeFetch.Response

    ModuleLogger.debug('Polyfill', 'fetch', `The Fetch API has been polyfilled with node-fetch.`)
  }

  /**
   * Polyfills the File object.
   */
  static async file(): Promise<void> {
    let NodeFetch: any | Error, Blob: any, FormData: any, data: FormData

    if (Environment.isFetchDefined) {
      return
    }

    NodeFetch = await tcp(() => Environment.import('node-fetch'))
    if (NodeFetch instanceof Error) return

    Blob = (await new NodeFetch.Response().blob()).constructor
    FormData = (await new NodeFetch.Response(new URLSearchParams()).formData()).constructor

    data = new FormData()
    data.set('a', new Blob())

    global.File = data.get('a')?.constructor as any

    ModuleLogger.debug('Polyfill', 'formData', `The FormData object has been polyfilled with node-fetch.`)
  }

  /**
   * Polyfills the FormData object.
   */
  static async formData(): Promise<void> {
    let NodeFetch: any | Error

    if (Environment.isFetchDefined) {
      return
    }

    NodeFetch = await tcp(() => Environment.import('node-fetch'))
    if (NodeFetch instanceof Error) return

    global.FormData = (await new NodeFetch.Response(new URLSearchParams()).formData()).constructor

    ModuleLogger.debug('Polyfill', 'formData', `The FormData object has been polyfilled with node-fetch.`)
  }
}
