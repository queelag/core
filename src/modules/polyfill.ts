import { NodeFetch } from '../definitions/interfaces.js'
import { tcp } from '../functions/tcp.js'
import { UtilLogger } from '../loggers/util-logger.js'
import { Environment } from './environment.js'

export async function useNodeFetch(NodeFetch: NodeFetch | Error): Promise<void> {
  if (NodeFetch instanceof Error) {
    return
  }

  if (Environment.isNotTest && Environment.isWindowDefined) {
    return
  }

  if (Environment.isBlobNotDefined) {
    global.Blob = NodeFetch.Blob
    UtilLogger.debug('useNodeFetch', `The Blob object has been polyfilled with node-fetch.`)
  }

  if (Environment.isFetchNotDefined) {
    global.fetch = NodeFetch.default
    global.Headers = NodeFetch.Headers
    global.Request = NodeFetch.Request
    global.Response = NodeFetch.Response

    UtilLogger.debug('useNodeFetch', `The Fetch API has been polyfilled with node-fetch.`)
  }

  if (Environment.isFileNotDefined) {
    global.File = NodeFetch.File
    UtilLogger.debug('useNodeFetch', `The File object has been polyfilled with node-fetch.`)
  }

  if (Environment.isFormDataNotDefined) {
    global.FormData = NodeFetch.FormData
    UtilLogger.debug('useNodeFetch', `The FormData object has been polyfilled with node-fetch.`)
  }
}

export async function importNodeFetch(): Promise<NodeFetch | Error> {
  if (Environment.isBlobDefined && Environment.isFetchDefined && Environment.isFileDefined && Environment.isFormDataDefined) {
    return new Error(`The Fetch API is already defined.`)
  }

  if (Environment.isNotTest && Environment.isWindowDefined) {
    return new Error('The Fetch API is already defined in the browser.')
  }

  return tcp(() => new Function(`return import('node-fetch')`)())
}
