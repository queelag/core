import { ID, StringUtils } from '..'
import { ModuleLogger } from '../loggers/module.logger'
import { noop } from './noop'

/**
 * A module to handle in an easier way web sockets.
 *
 * @category Module
 */
class _ {
  /**
   * A {@link WebSocket} instance.
   */
  instance: WebSocket
  /**
   * A string which determines the name of the web socket.
   */
  name: string
  /**
   * A string or array of strings which determines the protocols of the web socket.
   */
  protocols: string | string[] | undefined
  /**
   * A string which determines the URL of the web socket.
   */
  url: string

  constructor(
    name: string,
    url: string,
    protocols?: string | string[],
    onClose: (event: CloseEvent) => any = noop,
    onError: (event: Event) => any = noop,
    onMessage: (event: MessageEvent) => any = noop,
    onOpen: (event: Event) => any = noop
  ) {
    this.instance = {} as any
    this.name = name
    this.protocols = protocols
    this.url = url

    this.onClose = onClose
    this.onError = onError
    this.onMessage = onMessage
    this.onOpen = onOpen
  }

  _onClose(event: CloseEvent): any {}
  _onError(event: Event): any {}
  _onMessage(event: MessageEvent): any {}
  _onOpen(event: Event): any {}

  /**
   * Closes the connection.
   */
  async close(): Promise<boolean> {
    this.instance.close()
    ModuleLogger.debug(this.id, 'close', `The web socket is closing the connection.`)

    return new Promise((r) =>
      window.setInterval(() => {
        switch (true) {
          case this.isReadyStateClosed:
            return r(true)
          case this.isReadyStateConnecting:
          case this.isReadyStateOpen:
            return r(false)
        }
      }, 100)
    )
  }

  /**
   * Opens the connection.
   */
  async open(): Promise<boolean> {
    this.instance = new WebSocket(this.url, this.protocols)
    this.instance.onclose = this.onClose
    this.instance.onerror = this.onError
    this.instance.onmessage = this.onMessage
    this.instance.onopen = this.onOpen

    return new Promise((r) =>
      window.setInterval(() => {
        switch (true) {
          case this.isReadyStateClosed:
          case this.isReadyStateClosing:
            return r(false)
          case this.isReadyStateOpen:
            return r(true)
        }
      }, 100)
    )
  }

  /**
   * Sends a message.
   */
  send<T extends object>(data: T | ArrayBufferLike | ArrayBufferView | Blob | string): void {
    if (this.isReadyStateNotOpen) {
      ModuleLogger.warn(this.id, 'send', `The web socket ready state is not open, this message can't be sent.`)
      return
    }

    switch (true) {
      case data instanceof ArrayBuffer:
      // case data instanceof SharedArrayBuffer:
      case data instanceof Blob:
        this.instance.send(data as any)
        ModuleLogger.debug(this.id, 'send', `The message has been sent.`, data)

        break
      default:
        switch (typeof data) {
          case 'object':
            this.instance.send(JSON.stringify(data))
            ModuleLogger.debug(this.id, 'send', `The message has been sent.`, data)

            break
          case 'string':
            this.instance.send(data)
            ModuleLogger.debug(this.id, 'send', `The message has been sent.`, [data])

            break
        }

        break
    }
  }

  get onClose(): (event: CloseEvent) => any {
    return this._onClose
  }

  get onError(): (event: Event) => any {
    return this._onError
  }

  get onMessage(): (event: MessageEvent) => any {
    return this._onMessage
  }

  get onOpen(): (event: Event) => any {
    return this._onOpen
  }

  get id(): ID {
    return 'WEB_SOCKET_' + this.name
  }

  get isReadyStateClosed(): boolean {
    return this.instance.readyState === WebSocket.CLOSED
  }

  get isReadyStateNotClosed(): boolean {
    return this.instance.readyState !== WebSocket.CLOSED
  }

  get isReadyStateClosing(): boolean {
    return this.instance.readyState === WebSocket.CLOSING
  }

  get isReadyStateNotClosing(): boolean {
    return this.instance.readyState !== WebSocket.CLOSING
  }

  get isReadyStateConnecting(): boolean {
    return this.instance.readyState === WebSocket.CONNECTING
  }

  get isReadyStateNotConnecting(): boolean {
    return this.instance.readyState !== WebSocket.CONNECTING
  }

  get isReadyStateOpen(): boolean {
    return this.instance.readyState === WebSocket.OPEN
  }

  get isReadyStateNotOpen(): boolean {
    return this.instance.readyState !== WebSocket.OPEN
  }

  set onClose(onClose: (event: CloseEvent) => any) {
    this._onClose = (event: CloseEvent) => {
      ModuleLogger.debug(this.id, 'onClose', `The web socket connection has been closed.`, event)

      onClose(event)
    }
  }

  set onError(onError: (event: Event) => any) {
    this._onClose = (event: Event) => {
      ModuleLogger.debug(this.id, 'onError', `The web socket crashed.`, event)

      onError(event)
    }
  }

  set onMessage(onMessage: (event: MessageEvent) => any) {
    this._onMessage = (event: MessageEvent) => {
      ModuleLogger.debug(this.id, 'onMessage', `The web socket received a message.`, event)

      switch (true) {
        case StringUtils.isJSON(event.data):
          // @ts-ignore
          event.data = JSON.parse(event.data)
          ModuleLogger.debug(this.id, 'onMessage', `The message has been JSON parsed.`, event.data)

          break
      }

      onMessage(event)
    }
  }

  set onOpen(onOpen: (event: Event) => any) {
    this._onOpen = (event: Event) => {
      ModuleLogger.debug(this.id, 'onOpen', `The web socket connection has been opened.`, event)

      onOpen(event)
    }
  }
}

export { _ as WebSocket }
