import { DEFAULT_STATUS_TRANSFORMER } from '../definitions/constants.js'
import { StatusTransformer } from '../definitions/types.js'
import { ClassLogger } from '../loggers/class-logger.js'

/**
 * The Status class manages the status of anything that can have a 4-state status: idle, pending, success, error.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/status)
 */
export class Status {
  /**
   * The Map that stores the status of each key.
   */
  readonly data: Map<string, string>
  /**
   * The function that transforms the keys before storing them in the Map.
   */
  readonly transformer: StatusTransformer

  constructor(transformer: StatusTransformer = DEFAULT_STATUS_TRANSFORMER) {
    this.data = new Map()
    this.transformer = transformer
  }

  /**
   * Retrieves the status of the given keys.
   */
  get(...keys: string[]): string {
    return this.data.get(this.transformer(keys)) ?? Status.IDLE
  }

  /**
   * Sets the status of the given keys to idle.
   */
  idle(...keys: string[]): void {
    this.set(keys, Status.IDLE)
  }

  /**
   * Sets the status of the given keys to pending.
   */
  pending(...keys: string[]): void {
    this.set(keys, Status.PENDING)
  }

  /**
   * Sets the status of the given keys to success.
   */
  success(...keys: string[]): void {
    this.set(keys, Status.SUCCESS)
  }

  /**
   * Sets the status of the given keys to error.
   */
  error(...keys: string[]): void {
    this.set(keys, Status.ERROR)
  }

  /**
   * Sets the status of the given keys to the given status.
   */
  set(keys: string[], status: string): void {
    this.data.set(this.transformer(keys), status)
    ClassLogger.debug('Status', 'set', `The status for the key ${this.transformer(keys)} has been set to ${status}.`)
  }

  /**
   * Clears the status of every key.
   */
  clear(): void {
    this.data.clear()
    ClassLogger.debug('Status', 'clear', `Every status has been set to ${Status.IDLE}.`)
  }

  /**
   * Checks if the status of the given keys is idle.
   */
  isIdle(...keys: string[]): boolean {
    return this.get(...keys) === Status.IDLE
  }

  /**
   * Checks if the status of the given keys is pending.
   */
  isPending(...keys: string[]): boolean {
    return this.get(...keys) === Status.PENDING
  }

  /**
   * Checks if the status of the given keys is success.
   */
  isSuccess(...keys: string[]): boolean {
    return this.get(...keys) === Status.SUCCESS
  }

  /**
   * Checks if the status of the given keys is error.
   */
  isError(...keys: string[]): boolean {
    return this.get(...keys) === Status.ERROR
  }

  /**
   * Checks if the status of every given key is idle.
   */
  isEveryIdle(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isIdle(...v))
  }

  /**
   * Checks if the status of every given key is pending.
   */
  isEveryPending(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks if the status of every given key is success.
   */
  isEverySuccess(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isSuccess(...v))
  }

  /**
   * Checks if the status of every given key is error.
   */
  isEveryError(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isError(...v))
  }

  /**
   * Checks if the status of some given key is idle.
   */
  areSomeIdle(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isIdle(...v))
  }

  /**
   * Checks if the status of some given key is pending.
   */
  areSomePending(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks if the status of some given key is success.
   */
  areSomeSuccess(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isSuccess(...v))
  }

  /**
   * Checks if the status of some given key is error.
   */
  areSomeError(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isError(...v))
  }

  static get IDLE(): string {
    return 'IDLE'
  }

  static get PENDING(): string {
    return 'PENDING'
  }

  static get SUCCESS(): string {
    return 'SUCCESS'
  }

  static get ERROR(): string {
    return 'ERROR'
  }
}
