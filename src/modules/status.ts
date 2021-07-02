import { StatusTransformer } from '../definitions/types'
import { Logger } from './logger'

export class Status {
  readonly data: Map<string, string> = new Map()

  constructor(transformer: StatusTransformer = Status.defaultTransformer) {
    this.transformer = transformer
  }

  private get(keys: string[]): string {
    return this.data.get(this.transformer(keys)) || this.IDLE
  }

  idle(...keys: string[]): void {
    this.set(keys, this.IDLE)
  }

  pending(...keys: string[]): void {
    this.set(keys, this.PENDING)
  }

  success(...keys: string[]): void {
    this.set(keys, this.SUCCESS)
  }

  error(...keys: string[]): void {
    this.set(keys, this.ERROR)
  }

  private set(keys: string[], status: string): void {
    this.data.set(this.transformer(keys), status)
    Logger.debug('Status', 'set', `The status for the key ${this.transformer(keys)} has been set to ${status}.`)
  }

  clear(): void {
    this.data.clear()
    Logger.debug('Status', 'clear', `Every status has been set to ${this.IDLE}.`)
  }

  private transformer(keys: string[]): string {
    return keys.join('_')
  }

  isIdle(...keys: string[]): boolean {
    return this.get(keys) === this.IDLE
  }

  isPending(...keys: string[]): boolean {
    return this.get(keys) === this.PENDING
  }

  isSuccess(...keys: string[]): boolean {
    return this.get(keys) === this.SUCCESS
  }

  isError(...keys: string[]): boolean {
    return this.get(keys) === this.ERROR
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
    return keys.some((v: string[]) => this.isPending(...v))
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

  private get IDLE(): string {
    return 'IDLE'
  }

  private get PENDING(): string {
    return 'PENDING'
  }

  private get SUCCESS(): string {
    return 'SUCCESS'
  }

  private get ERROR(): string {
    return 'ERROR'
  }

  static get defaultTransformer(): StatusTransformer {
    return (keys: string[]) => keys.join('_')
  }
}
