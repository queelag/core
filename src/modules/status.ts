import { Logger } from './logger'

class Status {
  readonly data: Map<string, string> = new Map()

  get(keys: string[]): string {
    return this.data.get(keys.join('_')) || this.IDLE
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

  set(keys: string[], status: string): void {
    this.data.set(keys.join('_'), status)
    Logger.debug('Status', 'set', `The status for the key ${keys.join('_')} has been set to ${status}.`)
  }

  clear(): void {
    this.data.clear()
    Logger.debug('Status', 'clear', `Every status has been set to ${this.IDLE}.`)
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

  get IDLE(): string {
    return 'IDLE'
  }

  get PENDING(): string {
    return 'PENDING'
  }

  get SUCCESS(): string {
    return 'SUCCESS'
  }

  get ERROR(): string {
    return 'ERROR'
  }
}

export { Status }
