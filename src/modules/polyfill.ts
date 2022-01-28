import { ModuleLogger } from '../loggers/module.logger'
import { Environment } from './environment'
import { tcp } from './tcp'

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

    if (Environment.isBlobDefined) {
      return
    }

    NodeFetch = await tcp(() => Environment.import('node-fetch'))
    if (NodeFetch instanceof Error) return

    global.Blob = NodeFetch.Blob

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
    let NodeFetch: any | Error

    if (Environment.isFileDefined) {
      return
    }

    NodeFetch = await tcp(() => Environment.import('node-fetch'))
    if (NodeFetch instanceof Error) return

    global.File = NodeFetch.File

    ModuleLogger.debug('Polyfill', 'file', `The File object has been polyfilled with node-fetch.`)
  }

  /**
   * Polyfills the FormData object.
   */
  static async formData(): Promise<void> {
    let NodeFetch: any | Error

    if (Environment.isFormDataDefined) {
      return
    }

    NodeFetch = await tcp(() => Environment.import('node-fetch'))
    if (NodeFetch instanceof Error) return

    global.FormData = NodeFetch.FormData

    ModuleLogger.debug('Polyfill', 'formData', `The FormData object has been polyfilled with node-fetch.`)
  }
}
