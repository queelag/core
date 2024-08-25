import { DEFAULT_QUEUE_CONCURRENCY, DEFAULT_QUEUE_DELAY, DEFAULT_QUEUE_TIMEOUT } from '../definitions/constants.js'
import type { QueueEvents, QueueOptions, QueueProcess } from '../definitions/interfaces.js'
import type { QueueFunction, QueueStatus } from '../definitions/types.js'
import { sleep } from '../functions/sleep.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { removeArrayItems } from '../utils/array-utils.js'
import { generateRandomString } from '../utils/string-utils.js'
import { setTimeout } from '../utils/timeout-utils.js'
import { EventEmitter } from './event-emitter.js'

export class Queue extends EventEmitter<QueueEvents> {
  protected concurrency: number
  protected delay: number
  protected processes: QueueProcess[]
  protected status: QueueStatus
  protected timeout: number

  constructor(options?: QueueOptions) {
    super()

    this.concurrency = options?.concurrency ?? DEFAULT_QUEUE_CONCURRENCY
    this.delay = options?.delay ?? DEFAULT_QUEUE_DELAY
    this.processes = []
    this.status = options?.autostart ? 'running' : 'stopped'
    this.timeout = options?.timeout ?? DEFAULT_QUEUE_TIMEOUT
  }

  start(): this {
    if (this.status === 'running') {
      ClassLogger.warn('Queue', 'start', `The queue is already running.`, [this.status])
      return this
    }

    this.status = 'running'
    ClassLogger.verbose('Queue', 'start', `The status has been set.`, [this.status])

    ClassLogger.verbose('Queue', 'start', `Running the processes...`, this.processes)
    this.run()

    return this
  }

  stop(): this {
    if (this.status === 'stopped') {
      ClassLogger.warn('Queue', 'stop', `The queue is already stopped.`, [this.status])
      return this
    }

    this.status = 'stopped'
    ClassLogger.verbose('Queue', 'stop', `The status has been set.`, [this.status])

    return this
  }

  clear(): this {
    this.processes = []
    ClassLogger.verbose('Queue', 'clear', `The processes have been cleared.`, this.processes)

    return this
  }

  protected run(): void {
    if (this.isStatusStopped) {
      return ClassLogger.warn('Queue', 'run', `The queue is stopped.`, [this.status])
    }

    for (let process of this.processes.filter((process: QueueProcess) => process.status === 'pending')) {
      if (this.processes.filter((process: QueueProcess) => process.status === 'running').length >= this.concurrency) {
        break
      }

      if (this.delay > 0 && !this.processes.every((process: QueueProcess) => process.status === 'pending')) {
        this.processes = removeArrayItems(this.processes, (_, process: QueueProcess) =>
          ['fulfilled', 'rejected', 'running', 'timed-out'].includes(process.status)
        )

        ClassLogger.verbose('Queue', 'start', `Waiting for the delay...`, [this.delay])
        sleep(this.delay).then(() => this.runp(process))

        continue
      }

      this.runp(process)
    }
  }

  protected runp(process: QueueProcess): void {
    process.status = 'running'
    ClassLogger.verbose('Queue', 'start', `Running process.`, process)

    this.emit('process-run', process)

    process
      .fn()
      .catch((reason: any) => {
        process.reason = reason
        process.status = 'rejected'

        ClassLogger.error('Queue', process.id, `The process has been rejected.`, process)

        this.emit('process-reject', process)
      })
      .then((value: unknown) => {
        process.status = 'fulfilled'
        process.value = value

        ClassLogger.verbose('Queue', process.id, `The process has been fulfilled.`, process)

        this.emit('process-fulfill', process)
      })
      .finally(() => {
        if (this.delay <= 0) {
          this.processes = removeArrayItems(this.processes, [process])
        }

        ClassLogger.verbose('Queue', process.id, `Running the processes...`, this.processes)
        this.run()
      })

    setTimeout(() => {
      process.status = 'timed-out'
      ClassLogger.verbose('Queue', process.id, `The process has timed out.`, process)

      if (this.delay <= 0) {
        this.processes = removeArrayItems(this.processes, [process])
      }

      this.emit('process-timeout', process)
    }, this.timeout)
  }

  push(fns: QueueFunction[]): this
  push(...fns: QueueFunction[]): this
  push(...args: any[]): this {
    let fns: QueueFunction[]

    fns = typeof args[0] === 'function' ? args : args[0]
    if (fns.length <= 0) return this

    for (let fn of fns) {
      let process: QueueProcess

      process = {
        fn,
        id: generateRandomString({ prefix: 'process' }),
        status: 'pending'
      }

      this.processes.push(process)
      ClassLogger.verbose('Queue', 'push', `The process has been pushed.`, process)
    }

    if (this.isStatusRunning) {
      ClassLogger.verbose('Queue', 'push', `Running the processes...`, this.processes)
      this.run()
    }

    return this
  }

  unshift(fns: QueueFunction[]): this
  unshift(...fns: QueueFunction[]): this
  unshift(...args: any[]): this {
    let fns: QueueFunction[]

    fns = typeof args[0] === 'function' ? args : args[0]
    if (fns.length <= 0) return this

    for (let fn of fns) {
      let process: QueueProcess

      process = {
        fn,
        id: generateRandomString({ prefix: 'process' }),
        status: 'pending'
      }

      this.processes.unshift(process)
      ClassLogger.verbose('Queue', 'unshift', `The process has been unshifted.`, process)
    }

    if (this.isStatusRunning) {
      ClassLogger.verbose('Queue', 'unshift', `Running the processes...`, this.processes)
      this.run()
    }

    return this
  }

  getConcurrency(): number {
    return this.concurrency
  }

  getDelay(): number {
    return this.delay
  }

  getProcesses(): QueueProcess[] {
    return this.processes
  }

  getStatus(): QueueStatus {
    return this.status
  }

  getTimeout(): number {
    return this.timeout
  }

  setConcurrency(concurrency: number): this {
    this.concurrency = concurrency
    ClassLogger.verbose('Queue', 'setConcurrency', `The concurrency has been set.`, [this.concurrency])

    return this
  }

  setDelay(delay: number): this {
    this.delay = delay
    ClassLogger.verbose('Queue', 'setDelay', `The delay has been set.`, [this.delay])

    return this
  }

  setTimeout(timeout: number): this {
    this.timeout = timeout
    ClassLogger.verbose('Queue', 'setTimeout', `The timeout has been set.`, [this.timeout])

    return this
  }

  get isStatusRunning(): boolean {
    return this.status === 'running'
  }

  get isStatusStopped(): boolean {
    return this.status === 'stopped'
  }
}
