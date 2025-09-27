import { describe, expect, test } from 'vitest'
import { STUB_STORAGE, STUB_TEXT_DECODER, STUB_TEXT_ENCODER } from '../../src/definitions/stubs'

describe('Stubs', () => {
  test('storage', () => {
    let storage: Storage

    storage = STUB_STORAGE(new Map())

    expect(storage.clear()).toBeUndefined()
    expect(storage.getItem('name')).toBeNull()
    expect(storage.key(0)).toBeNull()
    expect(storage.removeItem('name')).toBeUndefined()
    expect(storage.length).toBe(0)

    expect(storage.setItem('name', 'john')).toBeUndefined()
    expect(storage.getItem('name')).toBe('john')
    expect(storage.key(0)).toBe('name')
    expect(storage.length).toBe(1)
  })

  test('text decoder', () => {
    expect(STUB_TEXT_DECODER.decode()).toBe('')
  })

  test('text encoder', () => {
    expect(STUB_TEXT_ENCODER.encode()).toStrictEqual(new Uint8Array())
    expect(STUB_TEXT_ENCODER.encodeInto('', new Uint8Array())).toStrictEqual({ read: 0, written: 0 })
  })
})
