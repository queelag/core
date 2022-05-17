import { ModuleLogger } from '../loggers/module.logger'
import { Environment } from './environment'
import { tc } from './tc'
import { tcp } from './tcp'

interface NodeFetch {
  default: any
  Blob: any
  File: any
  FormData: any
  Headers: any
  Request: any
  Response: any
}

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
    let NodeFetch: NodeFetch | Error

    if (Environment.isBlobDefined) {
      return
    }

    if (Environment.isNotJest && Environment.isWindowDefined) {
      return
    }

    NodeFetch = await this.getNodeFetch()
    if (NodeFetch instanceof Error) return

    global.Blob = NodeFetch.Blob

    ModuleLogger.debug('Polyfill', 'blob', `The Blob object has been polyfilled with node-fetch.`)
  }

  /**
   * Polyfills the Fetch API.
   */
  static async fetch(): Promise<void> {
    let NodeFetch: NodeFetch | Error

    if (Environment.isFetchDefined) {
      return
    }

    if (Environment.isNotJest && Environment.isWindowDefined) {
      return
    }

    NodeFetch = await this.getNodeFetch()
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
    let NodeFetch: NodeFetch | Error

    if (Environment.isFileDefined) {
      return
    }

    if (Environment.isNotJest && Environment.isWindowDefined) {
      return
    }

    NodeFetch = await this.getNodeFetch()
    if (NodeFetch instanceof Error) return

    global.File = NodeFetch.File

    ModuleLogger.debug('Polyfill', 'file', `The File object has been polyfilled with node-fetch.`)
  }

  /**
   * Polyfills the FormData object.
   */
  static async formData(): Promise<void> {
    let NodeFetch: NodeFetch | Error

    if (Environment.isFormDataDefined) {
      return
    }

    if (Environment.isNotJest && Environment.isWindowDefined) {
      return
    }

    NodeFetch = await this.getNodeFetch()
    if (NodeFetch instanceof Error) return

    global.FormData = NodeFetch.FormData

    ModuleLogger.debug('Polyfill', 'formData', `The FormData object has been polyfilled with node-fetch.`)
  }

  static async getNodeFetch(): Promise<NodeFetch | Error> {
    switch (true) {
      case Environment.isJest:
        return tc(() => Environment.require('node-fetch-cjs'))
      default:
        return tcp(() => Environment.import('node-fetch'))
    }
  }
}
