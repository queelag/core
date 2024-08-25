import { describe, expect, it } from 'vitest'
import { QueueFunction, wf } from '../../src'
import { DeferredPromise } from '../../src/classes/deferred-promise'
import { Queue } from '../../src/classes/queue'
import { QueueProcess } from '../../src/definitions/interfaces'
import { sleep } from '../../src/functions/sleep'

describe('Queue', () => {
  it('runs the processes with a manual start', async () => {
    let queue: Queue, p1: DeferredPromise<number>, p2: DeferredPromise<number>, processes: QueueProcess[]

    queue = new Queue({ concurrency: 1 })

    p1 = new DeferredPromise()
    p2 = new DeferredPromise()

    queue.push(
      () => sleep(100).then(() => p1.resolve(1)),
      () => sleep(200).then(() => p2.resolve(2))
    )

    processes = queue.getProcesses()

    expect(processes).toHaveLength(2)
    expect(processes[0].status).toBe('pending')
    expect(processes[1].status).toBe('pending')

    queue.start()

    expect(processes[0].status).toBe('running')
    expect(processes[1].status).toBe('pending')

    await p1.instance
    await wf(() => queue.getProcesses().length === 1)

    processes = queue.getProcesses()

    expect(processes).toHaveLength(1)
    expect(processes[0].status).toBe('running')

    await p2.instance
    await wf(() => queue.getProcesses().length === 0)

    expect(queue.getProcesses()).toHaveLength(0)
  })

  it('runs the process with automatic start', async () => {
    let queue: Queue, p1: DeferredPromise<number>, p2: DeferredPromise<number>, processes: QueueProcess[]

    queue = new Queue({ autostart: true, concurrency: 1 })

    p1 = new DeferredPromise()
    p2 = new DeferredPromise()

    queue.push(
      () => sleep(100).then(() => p1.resolve(1)),
      () => sleep(200).then(() => p2.resolve(2))
    )

    processes = queue.getProcesses()

    expect(processes).toHaveLength(2)
    expect(processes[0].status).toBe('running')
    expect(processes[1].status).toBe('pending')

    await p1.instance
    await wf(() => queue.getProcesses().length === 1)

    processes = queue.getProcesses()

    expect(processes).toHaveLength(1)
    expect(processes[0].status).toBe('running')

    await p2.instance
    await wf(() => queue.getProcesses().length === 0)

    expect(queue.getProcesses()).toHaveLength(0)
  })

  it('runs multiple processes at once', async () => {
    let queue: Queue, p1: DeferredPromise<number>, p2: DeferredPromise<number>, processes: QueueProcess[]

    queue = new Queue({ autostart: true })

    p1 = new DeferredPromise()
    p2 = new DeferredPromise()

    queue.push(
      () => sleep(100).then(() => p1.resolve(1)),
      () => sleep(200).then(() => p2.resolve(2))
    )

    processes = queue.getProcesses()

    expect(processes).toHaveLength(2)
    expect(processes[0].status).toBe('running')
    expect(processes[1].status).toBe('running')

    await p1.instance
    await wf(() => queue.getProcesses().length === 1, 4)

    processes = queue.getProcesses()

    expect(processes).toHaveLength(1)
    expect(processes[0].status).toBe('running')

    await p2.instance
    await wf(() => queue.getProcesses().length === 0)

    expect(queue.getProcesses()).toHaveLength(0)
  })

  it('stops correctly in the middle', async () => {
    let queue: Queue, p1: DeferredPromise<number>, p2: DeferredPromise<number>, processes: QueueProcess[]

    queue = new Queue({ autostart: true, concurrency: 1 })

    p1 = new DeferredPromise()
    p2 = new DeferredPromise()

    queue.push(
      () => sleep(100).then(() => p1.resolve(1)),
      () => sleep(200).then(() => p2.resolve(2))
    )

    processes = queue.getProcesses()

    expect(processes).toHaveLength(2)
    expect(processes[0].status).toBe('running')
    expect(processes[1].status).toBe('pending')

    queue.stop()

    await p1.instance
    await wf(() => queue.getProcesses().length === 1)

    processes = queue.getProcesses()

    expect(processes).toHaveLength(1)
    expect(processes[0].status).toBe('pending')

    expect(p2.state).toBe('pending')
  })

  it('clears the queue', async () => {
    let queue: Queue, p1: DeferredPromise<number>, p2: DeferredPromise<number>, processes: QueueProcess[]

    queue = new Queue({ autostart: true, concurrency: 1 })

    p1 = new DeferredPromise()
    p2 = new DeferredPromise()

    queue.push(
      () => sleep(100).then(() => p1.resolve(1)),
      () => sleep(200).then(() => p2.resolve(2))
    )

    processes = queue.getProcesses()

    expect(processes).toHaveLength(2)
    expect(processes[0].status).toBe('running')
    expect(processes[1].status).toBe('pending')

    queue.clear()

    await p1.instance
    await wf(() => queue.getProcesses().length === 0)

    processes = queue.getProcesses()
    expect(processes).toHaveLength(0)

    expect(p2.state).toBe('pending')
  })

  it('pushes and unshifts processes', async () => {
    let queue: Queue, p1: DeferredPromise<number>, p2: DeferredPromise<number>, fn1: QueueFunction, fn2: QueueFunction, processes: QueueProcess[]

    queue = new Queue({ autostart: true, concurrency: 1 })

    p1 = new DeferredPromise()
    p2 = new DeferredPromise()

    fn1 = () => p1.instance
    fn2 = () => p2.instance

    queue.push(fn1)
    queue.unshift(fn2)

    processes = queue.getProcesses()

    expect(processes).toHaveLength(2)
    expect(processes[0].fn).toBe(fn2)
    expect(processes[1].fn).toBe(fn1)
  })

  it('gets and sets the concurrency', () => {
    let queue: Queue

    queue = new Queue()
    expect(queue.getConcurrency()).toBe(Infinity)

    queue.setConcurrency(1)
    expect(queue.getConcurrency()).toBe(1)
  })

  it('gets the processes', () => {
    let queue: Queue, p1: DeferredPromise<number>, p2: DeferredPromise<number>, fn1: QueueFunction, fn2: QueueFunction, processes: QueueProcess[]

    queue = new Queue({ autostart: true, concurrency: 1 })

    p1 = new DeferredPromise()
    p2 = new DeferredPromise()

    fn1 = () => p1.instance
    fn2 = () => p2.instance

    queue.push(fn1, fn2)

    processes = queue.getProcesses()

    expect(processes).toHaveLength(2)
    expect(processes[0].fn).toBe(fn1)
    expect(processes[1].fn).toBe(fn2)
  })

  it('does not run the processes if the queue is stopped', async () => {
    let queue: Queue, p1: DeferredPromise<number>

    queue = new Queue()
    p1 = new DeferredPromise()

    queue.push(() => p1.instance)

    await sleep(100)
    expect(p1.state).toBe('pending')
  })

  it('emits the "process-run" event', async () => {
    let queue: Queue, p1: DeferredPromise<number>, event: DeferredPromise<QueueProcess>

    queue = new Queue()

    p1 = new DeferredPromise()
    event = new DeferredPromise()

    queue.push(() => p1.instance)
    queue.on('process-run', event.resolve)

    queue.start()

    await event.instance
    expect(event.value?.status).toBe('running')
  })

  it('emits the "process-fulfill" event', async () => {
    let queue: Queue, p1: DeferredPromise<number>, event: DeferredPromise<QueueProcess>

    queue = new Queue()

    p1 = new DeferredPromise()
    event = new DeferredPromise()

    queue.push(async () => p1.resolve(1))
    queue.on('process-fulfill', event.resolve)

    queue.start()

    await event.instance
    expect(event.value?.status).toBe('fulfilled')
  })

  it('emits the "process-reject" event', async () => {
    let queue: Queue, p1: DeferredPromise<number>, event: DeferredPromise<QueueProcess>

    queue = new Queue()

    p1 = new DeferredPromise()
    event = new DeferredPromise()

    queue.push(() => {
      p1.reject()
      return p1.instance
    })
    queue.on('process-reject', event.resolve)

    queue.start()

    await event.instance
    expect(event.value?.status).toBe('rejected')
  })

  it('emits the "process-timeout" event', async () => {
    let queue: Queue, p1: DeferredPromise<number>, event: DeferredPromise<QueueProcess>

    queue = new Queue({ timeout: 100 })

    p1 = new DeferredPromise()
    event = new DeferredPromise()

    queue.push(() => p1.instance)
    queue.on('process-timeout', event.resolve)

    queue.start()

    await event.instance
    expect(event.value?.status).toBe('timed-out')
  })

  it('delays the processes', async () => {
    let queue: Queue, p1: DeferredPromise<number>, p2: DeferredPromise<number>, processes: QueueProcess[], t1: number

    queue = new Queue({ autostart: true, concurrency: 1, delay: 100 })

    p1 = new DeferredPromise()
    p2 = new DeferredPromise()

    queue.push(
      async () => p1.resolve(1),
      async () => p2.resolve(2)
    )

    processes = queue.getProcesses()

    expect(processes).toHaveLength(2)
    expect(processes[0].status).toBe('running')
    expect(processes[1].status).toBe('pending')

    await p1.instance
    await wf(() => processes[0].status === 'fulfilled', 4)

    expect(processes[0].status).toBe('fulfilled')

    t1 = Date.now()

    await p2.instance
    await wf(() => queue.getProcesses().length === 1, 4)

    processes = queue.getProcesses()
    expect(processes).toHaveLength(1)

    await wf(() => processes[0].status === 'fulfilled', 4)
    expect(processes[0].status).toBe('fulfilled')

    expect(Date.now() - t1).toBeGreaterThanOrEqual(100)
  })
})
