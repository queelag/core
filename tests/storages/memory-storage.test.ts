import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryStorage } from '../../src'

describe('MemoryStorage', () => {
  beforeEach(() => {
    MemoryStorage.clear()
  })

  it('clears', () => {
    MemoryStorage.set('person', {})
    expect(MemoryStorage.has('person')).toBeTruthy()
    MemoryStorage.clear()
    expect(MemoryStorage.has('person')).toBeFalsy()
  })

  it('gets', () => {
    expect(MemoryStorage.get('person')).toBeUndefined()
    MemoryStorage.set('person', { name: 'john' })
    expect(MemoryStorage.get('person')).toStrictEqual({ name: 'john' })
  })

  it('has', () => {
    MemoryStorage.set('person', {})
    expect(MemoryStorage.has('person')).toBeTruthy()
  })

  it('removes', () => {
    MemoryStorage.set('person', {})
    expect(MemoryStorage.has('person')).toBeTruthy()
    MemoryStorage.remove('person')
    expect(MemoryStorage.has('person')).toBeFalsy()
  })

  it('sets', () => {
    MemoryStorage.set('person', {})
    expect(MemoryStorage.has('person')).toBeTruthy()
  })
})
