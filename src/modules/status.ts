import { StatusTransformer } from '../definitions/types'
import { Logger } from './logger'

/**
 * A module to keep track of status changes
 *
 * Usage:
 *
 * ```typescript
 * import { Sleep, Status } from '@queelag/core'
 *
 * const status = new Status()
 *
 * async function willError() {
 *   status.pending('will_error')
 *   await Sleep.for(1000)
 *   status.error('will_error')
 * }
 *
 * async function willSucceed() {
 *   status.pending('will_succeed')
 *   await Sleep.for(1000)
 *   status.error('will_succeed')
 * }
 *
 * console.log(status.isIdle('will_error'))
 * console.log(status.isIdle('will_succeed'))
 * // both log true
 *
 * willError().then(() => {
 *   console.log(status.isError('will_error'))
 *   // logs true
 * })
 *
 * willSucceed().then(() => {
 *   console.log(status.isSuccess('will_succeed'))
 *   // logs true
 * })
 *
 * console.log(status.isPending('will_error'))
 * console.log(status.isPending('will_succeed'))
 * // both log true
 * ```
 *
 * @category Module
 */
export class Status {
  /**
   * A map of strings
   */
  readonly data: Map<string, string> = new Map()

  /**
   * @param transformer A function to transform the string keys into a single string
   */
  constructor(transformer: StatusTransformer = Status.defaultTransformer) {
    this.transformer = transformer
  }

  /** @internal */
  private get(keys: string[]): string {
    return this.data.get(this.transformer(keys)) || this.IDLE
  }

  /**
   * Sets the transformed key to IDLE
   *
   * @param keys An array of strings
   */
  idle(...keys: string[]): void {
    this.set(keys, this.IDLE)
  }

  /**
   * Sets the transformed key to PENDING
   *
   * @param keys An array of strings
   */
  pending(...keys: string[]): void {
    this.set(keys, this.PENDING)
  }

  /**
   * Sets the transformed key to SUCCESS
   *
   * @param keys An array of strings
   */
  success(...keys: string[]): void {
    this.set(keys, this.SUCCESS)
  }

  /**
   * Sets the transformed key to ERROR
   *
   * @param keys An array of strings
   */
  error(...keys: string[]): void {
    this.set(keys, this.ERROR)
  }

  /** @internal */
  private set(keys: string[], status: string): void {
    this.data.set(this.transformer(keys), status)
    Logger.debug('Status', 'set', `The status for the key ${this.transformer(keys)} has been set to ${status}.`)
  }

  /**
   * Clears the {@link Status.data} map, every set status will go back to IDLE
   */
  clear(): void {
    this.data.clear()
    Logger.debug('Status', 'clear', `Every status has been set to ${this.IDLE}.`)
  }

  /** @internal */
  private transformer(keys: string[]): string {
    return keys.join('_')
  }

  /**
   * Checks whether the transformed key is IDLE
   *
   * @param keys An array of strings
   * @returns A value boolean
   */
  isIdle(...keys: string[]): boolean {
    return this.get(keys) === this.IDLE
  }

  /**
   * Checks whether the transformed key is PENDING
   *
   * @param keys An array of strings
   * @returns A value boolean
   */
  isPending(...keys: string[]): boolean {
    return this.get(keys) === this.PENDING
  }

  /**
   * Checks whether the transformed key is SUCCESS
   *
   * @param keys An array of strings
   * @returns A value boolean
   */
  isSuccess(...keys: string[]): boolean {
    return this.get(keys) === this.SUCCESS
  }

  /**
   * Checks whether the transformed key is ERROR
   *
   * @param keys An array of strings
   * @returns A value boolean
   */
  isError(...keys: string[]): boolean {
    return this.get(keys) === this.ERROR
  }

  /**
   * Checks whether every transformed keys is IDLE
   *
   * @param keys An array of array of strings
   * @returns A value boolean
   */
  isEveryIdle(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isIdle(...v))
  }

  /**
   * Checks whether every transformed keys is PENDING
   *
   * @param keys An array of array of strings
   * @returns A value boolean
   */
  isEveryPending(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks whether every transformed keys is SUCCESS
   *
   * @param keys An array of array of strings
   * @returns A value boolean
   */
  isEverySuccess(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isSuccess(...v))
  }

  /**
   * Checks whether every transformed keys is ERROR
   *
   * @param keys An array of array of strings
   * @returns A value boolean
   */
  isEveryError(...keys: string[][]): boolean {
    return keys.every((v: string[]) => this.isError(...v))
  }

  /**
   * Checks whether some of the transformed keys are IDLE
   *
   * @param keys An array of array of strings
   * @returns A value boolean
   */
  areSomeIdle(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks whether some of the transformed keys are PENDING
   *
   * @param keys An array of array of strings
   * @returns A value boolean
   */
  areSomePending(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks whether some of the transformed keys are SUCCESS
   *
   * @param keys An array of array of strings
   * @returns A value boolean
   */
  areSomeSuccess(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isPending(...v))
  }

  /**
   * Checks whether some of the transformed keys are ERROR
   *
   * @param keys An array of array of strings
   * @returns A value boolean
   */
  areSomeError(...keys: string[][]): boolean {
    return keys.some((v: string[]) => this.isError(...v))
  }

  /** @internal */
  private get IDLE(): string {
    return 'IDLE'
  }

  /** @internal */
  private get PENDING(): string {
    return 'PENDING'
  }

  /** @internal */
  private get SUCCESS(): string {
    return 'SUCCESS'
  }

  /** @internal */
  private get ERROR(): string {
    return 'ERROR'
  }

  /** @internal */
  static get defaultTransformer(): StatusTransformer {
    return (keys: string[]) => keys.join('_')
  }
}
