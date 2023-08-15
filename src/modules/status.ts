import { DEFAULT_STATUS_TRANSFORMER } from '../definitions/constants.js'
import { StatusTransformer } from '../definitions/types.js'
import { ModuleLogger } from '../loggers/module-logger.js'

/**
 * @category Module
 */
export class Status {
  readonly data: Map<string, string>
  readonly transformer: StatusTransformer

  constructor(transformer: StatusTransformer = DEFAULT_STATUS_TRANSFORMER) {
    this.data = new Map()
    this.transformer = transformer
  }

  get(...keys: string[]): string {
    return this.data.get(this.transformer(keys)) || Status.IDLE
  }

  idle(...keys: string[]): void {
    this.set(keys, Status.IDLE)
  }

  pending(...keys: string[]): void {
    this.set(keys, Status.PENDING)
  }

  success(...keys: string[]): void {
    this.set(keys, Status.SUCCESS)
  }

  error(...keys: string[]): void {
    this.set(keys, Status.ERROR)
  }

  set(keys: string[], status: string): void {
    this.data.set(this.transformer(keys), status)
    ModuleLogger.debug('Status', 'set', `The status for the key ${this.transformer(keys)} has been set to ${status}.`)
  }

  clear(): void {
    this.data.clear()
    ModuleLogger.debug('Status', 'clear', `Every status has been set to ${Status.IDLE}.`)
  }

  isIdle(...keys: string[]): boolean {
    return this.get(...keys) === Status.IDLE
  }

  isPending(...keys: string[]): boolean {
    return this.get(...keys) === Status.PENDING
  }

  isSuccess(...keys: string[]): boolean {
    return this.get(...keys) === Status.SUCCESS
  }

  isError(...keys: string[]): boolean {
    return this.get(...keys) === Status.ERROR
  }

  isEveryIdle(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isIdle(...v))
  }

  isEveryPending(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isPending(...v))
  }

  isEverySuccess(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isSuccess(...v))
  }

  isEveryError(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isError(...v))
  }

  areSomeIdle(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isIdle(...v))
  }

  areSomePending(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isPending(...v))
  }

  areSomeSuccess(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isPending(...v))
  }

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
