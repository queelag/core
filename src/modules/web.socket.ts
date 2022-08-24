import { WebSocketEventData } from '../definitions/types'
import { noop } from '../functions/noop'
import { tc } from '../functions/tc'
import { ModuleLogger } from '../loggers/module.logger'
import { isStringJSON } from '../utils/string'

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
  async close(): Promise<void | Error> {
    let close: void | Error

    close = tc(() => this.instance.close())
    if (close instanceof Error) return close

    ModuleLogger.debug(this.id, 'close', `The web socket is closing the connection.`)

    return new Promise((r) =>
      window.setInterval(() => {
        switch (true) {
          case this.isReadyStateClosed:
            return r()
          case this.isReadyStateConnecting:
          case this.isReadyStateOpen:
            return r()
        }
      }, 100)
    )
  }

  /**
   * Opens the connection.
   */
  async open(): Promise<void | Error> {
    let socket: WebSocket | Error

    socket = tc(() => new WebSocket(this.url, this.protocols))
    if (socket instanceof Error) return socket

    this.instance = socket
    this.instance.onclose = this.onClose
    this.instance.onerror = this.onError
    this.instance.onmessage = this.onMessage
    this.instance.onopen = this.onOpen

    return new Promise((r) =>
      window.setInterval(() => {
        switch (true) {
          case this.isReadyStateClosed:
          case this.isReadyStateClosing:
            return r()
          case this.isReadyStateOpen:
            return r()
        }
      }, 100)
    )
  }

  /**
   * Sends a message.
   */
  send<T extends object>(data: WebSocketEventData<T>): void | Error {
    let tdata: WebSocketEventData<T>, send: void | Error

    if (this.isReadyStateNotOpen) {
      ModuleLogger.warn(this.id, 'send', `The web socket ready state is not open, this message can't be sent.`)
      return
    }

    switch (true) {
      case data instanceof ArrayBuffer:
      case data instanceof Blob:
        tdata = data
        ModuleLogger.debug(this.id, 'send', `The data is an ArrayBuffer or Blob, no transformations are needed.`, tdata)

        break
      default:
        switch (typeof data) {
          case 'object':
            tdata = JSON.stringify(data)
            ModuleLogger.debug(this.id, 'send', `The data has been transformed.`, [tdata])

            break
          default:
            tdata = data
            break
        }
        break
    }

    tdata = this.transformOutgoingData(data)

    send = tc(() => this.instance.send(tdata as any))
    if (send instanceof Error) return send

    return
  }

  transformIncomingData<T extends object>(data: WebSocketEventData<T>): WebSocketEventData<T> {
    return data
  }

  transformOutgoingData<T extends object>(data: WebSocketEventData<T>): WebSocketEventData<T> {
    return data
  }

  setBinaryType(type: BinaryType): void {
    this.instance.binaryType = type
    ModuleLogger.debug(this.id, 'setBinaryType', `The binary type has been set to ${type}.`)
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

  get id(): string {
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
    this._onError = (event: Event) => {
      ModuleLogger.debug(this.id, 'onError', `The web socket crashed.`, event)

      onError(event)
    }
  }

  set onMessage(onMessage: (event: MessageEvent) => any) {
    this._onMessage = (event: MessageEvent) => {
      ModuleLogger.debug(this.id, 'onMessage', `The web socket received a message.`, event)

      switch (true) {
        case isStringJSON(event.data):
          event = { ...event, data: JSON.parse(event.data) }
          ModuleLogger.debug(this.id, 'onMessage', `The message has been JSON parsed.`, event.data)

          break
      }

      event = { ...event, data: this.transformIncomingData(event.data) }

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
