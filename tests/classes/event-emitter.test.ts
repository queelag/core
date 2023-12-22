import { Mock, beforeEach, describe, expect, it, vitest } from 'vitest'
import { EventEmitter, EventEmitterEvents, noop } from '../../src'
import { DEFAULT_EVENT_EMITTER_MAX_LISTENERS } from '../../src/definitions/constants'

interface Events extends EventEmitterEvents {
  one: (value: number) => void
  two: (value: number) => void
}

describe('EventEmitter', () => {
  let emitter: EventEmitter<Events>

  beforeEach(() => {
    emitter = new EventEmitter()
  })

  it('adds a listener', () => {
    emitter.on('one', noop)
    expect(emitter.getListeners()).toStrictEqual([{ callback: noop, name: 'one', options: undefined }])

    emitter.off()
    emitter.on('one', noop)
    expect(emitter.getListeners()).toStrictEqual([{ callback: noop, name: 'one', options: undefined }])

    emitter.off()
    emitter.on('one', noop, { once: true })
    expect(emitter.getListeners()).toStrictEqual([{ callback: noop, name: 'one', options: { once: true } }])

    emitter.off()
    emitter.on('one', noop, { prepend: true })
    expect(emitter.getListeners()).toStrictEqual([{ callback: noop, name: 'one', options: { prepend: true } }])

    emitter.off()
    emitter.on('one', noop, { once: true, prepend: true })
    expect(emitter.getListeners()).toStrictEqual([{ callback: noop, name: 'one', options: { prepend: true, once: true } }])
  })

  it('counts listeners', () => {
    emitter.on('one', noop)

    expect(emitter.countListeners()).toBe(1)
    expect(emitter.countListeners('one')).toBe(1)
    expect(emitter.countListeners('one', noop)).toBe(1)
    expect(emitter.countListeners('one', noop, { once: false })).toBe(1)
    expect(emitter.countListeners('one', noop, { prepend: false })).toBe(1)
    expect(emitter.countListeners('one', noop, { once: false, prepend: false })).toBe(1)

    emitter.off()
    emitter.on('one', noop, { once: true })

    expect(emitter.countListeners()).toBe(1)
    expect(emitter.countListeners('one')).toBe(1)
    expect(emitter.countListeners('one', noop)).toBe(1)
    expect(emitter.countListeners('one', noop, { once: true })).toBe(1)
    expect(emitter.countListeners('one', noop, { prepend: false })).toBe(1)
    expect(emitter.countListeners('one', noop, { once: true, prepend: false })).toBe(1)

    emitter.off()
    emitter.on('one', noop, { prepend: true })

    expect(emitter.countListeners()).toBe(1)
    expect(emitter.countListeners('one')).toBe(1)
    expect(emitter.countListeners('one', noop)).toBe(1)
    expect(emitter.countListeners('one', noop, { once: false })).toBe(1)
    expect(emitter.countListeners('one', noop, { prepend: true })).toBe(1)
    expect(emitter.countListeners('one', noop, { once: false, prepend: true })).toBe(1)

    emitter.off()
    emitter.on('one', noop, { once: true, prepend: true })

    expect(emitter.countListeners()).toBe(1)
    expect(emitter.countListeners('one')).toBe(1)
    expect(emitter.countListeners('one', noop)).toBe(1)
    expect(emitter.countListeners('one', noop, { once: true })).toBe(1)
    expect(emitter.countListeners('one', noop, { prepend: true })).toBe(1)
    expect(emitter.countListeners('one', noop, { once: true, prepend: true })).toBe(1)
  })

  it('emits event', () => {
    let callback: Mock = vitest.fn()

    emitter.on('one', callback)
    emitter.emit('one', 1)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(1)
  })

  it('returns event names', () => {
    emitter.on('one', noop)
    expect(emitter.getEventNames()).toStrictEqual(['one'])
  })

  it('gets listeners', () => {
    emitter.on('one', noop)

    expect(emitter.getListeners()).toStrictEqual([{ callback: noop, name: 'one', options: undefined }])
    expect(emitter.getListeners('one')).toStrictEqual([{ callback: noop, name: 'one', options: undefined }])
    expect(emitter.getListeners('one', noop, { once: false })).toStrictEqual([{ callback: noop, name: 'one', options: undefined }])
    expect(emitter.getListeners('one', noop, { prepend: false })).toStrictEqual([{ callback: noop, name: 'one', options: undefined }])
    expect(emitter.getListeners('one', noop, { once: false, prepend: false })).toStrictEqual([{ callback: noop, name: 'one', options: undefined }])

    emitter.off()
    emitter.on('one', noop, { once: true })

    expect(emitter.getListeners()).toStrictEqual([{ callback: noop, name: 'one', options: { once: true } }])
    expect(emitter.getListeners('one')).toStrictEqual([{ callback: noop, name: 'one', options: { once: true } }])
    expect(emitter.getListeners('one', noop, { once: true })).toStrictEqual([{ callback: noop, name: 'one', options: { once: true } }])
    expect(emitter.getListeners('one', noop, { prepend: false })).toStrictEqual([{ callback: noop, name: 'one', options: { once: true } }])
    expect(emitter.getListeners('one', noop, { once: true, prepend: false })).toStrictEqual([{ callback: noop, name: 'one', options: { once: true } }])

    emitter.off()
    emitter.on('one', noop, { prepend: true })

    expect(emitter.getListeners()).toStrictEqual([{ callback: noop, name: 'one', options: { prepend: true } }])
    expect(emitter.getListeners('one')).toStrictEqual([{ callback: noop, name: 'one', options: { prepend: true } }])
    expect(emitter.getListeners('one', noop, { once: false })).toStrictEqual([{ callback: noop, name: 'one', options: { prepend: true } }])
    expect(emitter.getListeners('one', noop, { prepend: true })).toStrictEqual([{ callback: noop, name: 'one', options: { prepend: true } }])
    expect(emitter.getListeners('one', noop, { once: false, prepend: true })).toStrictEqual([{ callback: noop, name: 'one', options: { prepend: true } }])

    emitter.off()
    emitter.on('one', noop, { once: true, prepend: true })

    expect(emitter.getListeners()).toStrictEqual([{ callback: noop, name: 'one', options: { once: true, prepend: true } }])
    expect(emitter.getListeners('one')).toStrictEqual([{ callback: noop, name: 'one', options: { once: true, prepend: true } }])
    expect(emitter.getListeners('one', noop, { once: true })).toStrictEqual([{ callback: noop, name: 'one', options: { once: true, prepend: true } }])
    expect(emitter.getListeners('one', noop, { prepend: true })).toStrictEqual([{ callback: noop, name: 'one', options: { once: true, prepend: true } }])
    expect(emitter.getListeners('one', noop, { once: true, prepend: true })).toStrictEqual([
      { callback: noop, name: 'one', options: { once: true, prepend: true } }
    ])
  })

  it('gets max listeners', () => {
    expect(emitter.getMaxListeners()).toBe(DEFAULT_EVENT_EMITTER_MAX_LISTENERS)
  })

  it('removes listeners', () => {
    emitter.on('one', noop)
    emitter.on('one', noop, { once: true })
    emitter.on('one', noop, { prepend: true })
    emitter.on('one', noop, { once: true, prepend: true })
    expect(emitter.countListeners()).toBe(4)

    emitter.off('one', noop, { once: true, prepend: true })
    expect(emitter.countListeners()).toBe(3)
    emitter.off('one', noop, { prepend: true })
    expect(emitter.countListeners()).toBe(2)
    emitter.off('one', noop, { once: true })
    expect(emitter.countListeners()).toBe(1)
    emitter.off('one', noop)
    expect(emitter.countListeners()).toBe(0)

    emitter.on('one', noop)
    emitter.on('one', noop, { once: true })
    emitter.on('one', noop, { prepend: true })
    emitter.on('one', noop, { once: true, prepend: true })
    expect(emitter.countListeners()).toBe(4)

    emitter.off('one', noop, { once: true, prepend: true })
    expect(emitter.countListeners()).toBe(3)
    emitter.off('one', noop, { prepend: true })
    expect(emitter.countListeners()).toBe(2)
    emitter.off('one', noop, { once: true })
    expect(emitter.countListeners()).toBe(1)
    emitter.off('one', noop)
    expect(emitter.countListeners()).toBe(0)
  })

  it('sets max listeners', () => {
    expect(emitter.getMaxListeners()).toBe(DEFAULT_EVENT_EMITTER_MAX_LISTENERS)
    emitter.setMaxListeners(20)
    expect(emitter.getMaxListeners()).toBe(20)
  })

  it('respects max listeners', () => {
    emitter.setMaxListeners(1)
    emitter.on('one', noop)
    expect(emitter.countListeners()).toBe(1)
    emitter.on('one', noop)
    expect(emitter.countListeners()).toBe(1)
  })

  it('runs listeners with prepend option first', () => {
    let t1: number, t2: number, c1: Mock, c2: Mock

    t1 = 0
    t2 = 0

    c1 = vitest.fn(() => {
      t1 = performance.now()
    })
    c2 = vitest.fn(() => {
      t2 = performance.now()
    })

    emitter.on('one', c1)
    emitter.on('one', c2, { prepend: true })
    emitter.emit('one', 1)

    expect(c1).toHaveBeenCalledOnce()
    expect(c2).toHaveBeenCalledOnce()

    expect(t2).toBeLessThan(t1)
  })

  it('runs listener with once option only one time', () => {
    let callback: Mock = vitest.fn()

    emitter.on('one', callback, { once: true })
    emitter.emit('one', 1)
    emitter.emit('one', 2)

    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith(1)
  })
})
