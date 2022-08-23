import { StatusTransformer } from '../definitions/types'
import { ModuleLogger } from '../loggers/module.logger'

/**
 * A module to keep track of status changes.
 *
 * @category Module
 */
export class Status {
  /**
   * A map of strings.
   */
  readonly data: Map<string, string> = new Map()

  /** @hidden */
  constructor(transformer: StatusTransformer = Status.DEFAULT_TRANSFORMER) {
    this.transformer = transformer
  }

  get(...keys: string[]): string {
    return this.data.get(this.transformer(keys)) || Status.IDLE
  }

  /**
   * Sets the transformed key to IDLE.
   */
  idle(...keys: string[]): void {
    this.set(keys, Status.IDLE)
  }

  /**
   * Sets the transformed key to PENDING.
   */
  pending(...keys: string[]): void {
    this.set(keys, Status.PENDING)
  }

  /**
   * Sets the transformed key to SUCCESS.
   */
  success(...keys: string[]): void {
    this.set(keys, Status.SUCCESS)
  }

  /**
   * Sets the transformed key to ERROR.
   */
  error(...keys: string[]): void {
    this.set(keys, Status.ERROR)
  }

  set(keys: string[], status: string): void {
    this.data.set(this.transformer(keys), status)
    ModuleLogger.debug('Status', 'set', `The status for the key ${this.transformer(keys)} has been set to ${status}.`)
  }

  /**
   * Clears the {@link Status.data} map, every set status will go back to IDLE.
   */
  clear(): void {
    this.data.clear()
    ModuleLogger.debug('Status', 'clear', `Every status has been set to ${Status.IDLE}.`)
  }

  /** @internal */
  private transformer(keys: string[]): string {
    return keys.join('_')
  }

  /**
   * Checks whether the transformed key is IDLE.
   */
  isIdle(...keys: string[]): boolean {
    return this.get(...keys) === Status.IDLE
  }

  /**
   * Checks whether the transformed key is PENDING.
   */
  isPending(...keys: string[]): boolean {
    return this.get(...keys) === Status.PENDING
  }

  /**
   * Checks whether the transformed key is SUCCESS.
   */
  isSuccess(...keys: string[]): boolean {
    return this.get(...keys) === Status.SUCCESS
  }

  /**
   * Checks whether the transformed key is ERROR.
   */
  isError(...keys: string[]): boolean {
    return this.get(...keys) === Status.ERROR
  }

  /**
   * Checks whether every transformed keys is IDLE.
   */
  isEveryIdle(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isIdle(...v))
  }

  /**
   * Checks whether every transformed keys is PENDING.
   */
  isEveryPending(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks whether every transformed keys is SUCCESS.
   */
  isEverySuccess(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isSuccess(...v))
  }

  /**
   * Checks whether every transformed keys is ERROR.
   */
  isEveryError(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isError(...v))
  }

  /**
   * Checks whether some of the transformed keys are IDLE.
   */
  areSomeIdle(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks whether some of the transformed keys are PENDING.
   */
  areSomePending(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks whether some of the transformed keys are SUCCESS.
   */
  areSomeSuccess(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks whether some of the transformed keys are ERROR.
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

  /** @internal */
  static get DEFAULT_TRANSFORMER(): StatusTransformer {
    return (keys: string[]) => keys.join('_')
  }
}
