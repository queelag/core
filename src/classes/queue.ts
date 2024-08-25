import { DEFAULT_QUEUE_CONCURRENCY, DEFAULT_QUEUE_TIMEOUT } from '../definitions/constants.js'
import type { QueueEvents, QueueOptions, QueueProcess } from '../definitions/interfaces.js'
import type { QueueFunction, QueueStatus } from '../definitions/types.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { removeArrayItems } from '../utils/array-utils.js'
import { generateRandomString } from '../utils/string-utils.js'
import { setTimeout } from '../utils/timeout-utils.js'
import { EventEmitter } from './event-emitter.js'

export class Queue extends EventEmitter<QueueEvents> {
  protected concurrency: number
  protected processes: QueueProcess[]
  protected status: QueueStatus
  protected timeout: number

  constructor(options?: QueueOptions) {
    super()

    this.concurrency = options?.concurrency ?? DEFAULT_QUEUE_CONCURRENCY
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

      process.status = 'running'
      ClassLogger.verbose('Queue', 'start', `Running process.`, process)

      this.emit('process-run', process)

      process
        .fn()
        .catch(() => {
          process.status = 'rejected'
          ClassLogger.verbose('Queue', process.id, `The process has been rejected.`, process)

          this.emit('process-reject', process)
        })
        .then((value) => {
          process.status = 'fulfilled'
          ClassLogger.verbose('Queue', process.id, `The process has been run.`, process)

          this.emit('process-fulfill', process)
        })
        .finally(() => {
          this.processes = removeArrayItems(this.processes, [process])
          ClassLogger.verbose('Queue', process.id, `The process has been removed.`, this.processes)

          ClassLogger.verbose('Queue', process.id, `Running the processes...`, this.processes)
          this.run()
        })

      setTimeout(() => {
        process.status = 'timed-out'
        ClassLogger.verbose('Queue', process.id, `The process has timed out.`, process)

        this.processes = removeArrayItems(this.processes, [process])
        ClassLogger.verbose('Queue', process.id, `The process has been removed.`, this.processes)

        this.emit('process-timeout', process)
      }, this.timeout)
    }
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

  getProcesses(): QueueProcess[] {
    return this.processes
  }

  setConcurrency(concurrency: number): this {
    this.concurrency = concurrency
    ClassLogger.verbose('Queue', 'setConcurrency', `The concurrency has been set.`, [this.concurrency])

    return this
  }

  get isStatusRunning(): boolean {
    return this.status === 'running'
  }

  get isStatusStopped(): boolean {
    return this.status === 'stopped'
  }
}
