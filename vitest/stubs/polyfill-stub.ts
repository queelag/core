import { vi } from 'vitest'
import { tcp } from '../../src/functions/tcp'
import { ModuleLogger } from '../../src/loggers/module-logger'
import { Environment } from '../../src/modules/environment'
import type { Polyfill as _ } from '../../src/modules/polyfill'

interface NodeFetch {
  default: any
  Blob: any
  File: any
  FormData: any
  Headers: any
  Request: any
  Response: any
}

class Polyfill implements _ {
  static async blob(): Promise<void> {
    let NodeFetch: NodeFetch | Error

    if (Environment.isBlobDefined) {
      return
    }

    if (Environment.isNotTest && Environment.isWindowDefined) {
      return
    }

    NodeFetch = await this.getNodeFetch()
    if (NodeFetch instanceof Error) return

    global.Blob = NodeFetch.Blob

    ModuleLogger.debug('Polyfill', 'blob', `The Blob object has been polyfilled with node-fetch.`)
  }

  static async fetch(): Promise<void> {
    let NodeFetch: NodeFetch | Error

    if (Environment.isFetchDefined) {
      return
    }

    if (Environment.isNotTest && Environment.isWindowDefined) {
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

  static async file(): Promise<void> {
    let NodeFetch: NodeFetch | Error

    if (Environment.isFileDefined) {
      return
    }

    if (Environment.isNotTest && Environment.isWindowDefined) {
      return
    }

    NodeFetch = await this.getNodeFetch()
    if (NodeFetch instanceof Error) return

    global.File = NodeFetch.File

    ModuleLogger.debug('Polyfill', 'file', `The File object has been polyfilled with node-fetch.`)
  }

  static async formData(): Promise<void> {
    let NodeFetch: NodeFetch | Error

    if (Environment.isFormDataDefined) {
      return
    }

    if (Environment.isNotTest && Environment.isWindowDefined) {
      return
    }

    NodeFetch = await this.getNodeFetch()
    if (NodeFetch instanceof Error) return

    global.FormData = NodeFetch.FormData

    ModuleLogger.debug('Polyfill', 'formData', `The FormData object has been polyfilled with node-fetch.`)
  }

  private static async getNodeFetch(): Promise<NodeFetch | Error> {
    return tcp(() => import('node-fetch'))
  }
}

vi.mock('../../src/modules/polyfill.ts', () => ({ Polyfill }))
