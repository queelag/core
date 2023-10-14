import { beforeEach, describe, expect, it } from 'vitest'
import { SyncStorage, cloneShallowObject, copyObjectProperty, rne, rv, setObjectProperty } from '../../src'
import { StorageItem } from '../../src/definitions/interfaces'
import { Configuration } from '../../src/modules/configuration'

describe('Storage', () => {
  let map: Map<string, any>, storage: SyncStorage

  beforeEach(() => {
    map = new Map()
    storage = new SyncStorage(
      'TestStorage',
      () => map.clear(),
      (key: string) => map.get(key),
      (key: string) => map.has(key),
      (key: string) => rv(() => map.delete(key)),
      (key: string, value: StorageItem) => rv(() => map.set(key, value))
    )
  })

  it('sets and gets an item', () => {
    storage.set('person', { name: 'john' })
    expect(storage.get('person')).toStrictEqual({ name: 'john' })

    storage.set('person', { name: 'robert', surname: 'smith' }, ['surname'])
    expect(storage.get('person')).toStrictEqual({ name: 'john', surname: 'smith' })
  })

  it('removes an item', () => {
    storage.set('person', { name: 'john', surname: 'doe' })
    expect(storage.has('person')).toBeTruthy()

    storage.remove('person', ['name'])
    expect(storage.has('person', ['name'])).toBeFalsy()
    expect(storage.has('person', ['surname'])).toBeTruthy()

    storage.remove('person')
    expect(storage.has('person')).toBeFalsy()
  })

  it('copies an item to a target object', () => {
    let target: StorageItem

    target = {}
    storage.set('person', { name: 'john', surname: 'doe' })

    storage.copy('person', target, ['name'])
    expect(target.name).toBe('john')

    storage.copy('person', target, ['surname'])
    expect(target.surname).toBe('doe')

    storage.set('person', { name: 'robert', surname: 'smith' })
    storage.copy('person', target)
    expect(target.name).toBe('robert')
    expect(target.surname).toBe('smith')
  })

  it('clears all items', () => {
    storage.set('p1', { name: 'john' })
    storage.set('p2', { name: 'robert' })

    expect(storage.has('p1')).toBeTruthy()
    expect(storage.has('p2')).toBeTruthy()

    storage.clear()

    expect(storage.has('p1')).toBeFalsy()
    expect(storage.has('p2')).toBeFalsy()
  })

  it('handles errors from internal methods', () => {
    let backup: SyncStorage

    backup = cloneShallowObject(storage)

    Configuration.module.tcp.log = false

    setObjectProperty(storage, '_clear', rne)
    expect(storage.clear()).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_clear', storage)

    setObjectProperty(storage, '_get', rne)
    expect(storage.get('person')).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', storage)

    setObjectProperty(storage, '_has', rne)
    expect(storage.has('person')).toBeFalsy()
    copyObjectProperty(backup, '_has', storage)

    setObjectProperty(storage, '_remove', rne)
    expect(storage.remove('person')).toBeInstanceOf(Error)
    setObjectProperty(storage, '_set', rne)
    expect(storage.remove('person', [])).toBeInstanceOf(Error)
    setObjectProperty(storage, '_get', rne)
    expect(storage.remove('person', [])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', storage)
    copyObjectProperty(backup, '_remove', storage)
    copyObjectProperty(backup, '_set', storage)

    setObjectProperty(storage, '_set', rne)
    expect(storage.set('person', { name: 'john' })).toBeInstanceOf(Error)
    setObjectProperty(storage, '_get', rne)
    expect(storage.set('person', { name: 'john' }, ['name'])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', storage)
    copyObjectProperty(backup, '_set', storage)

    setObjectProperty(storage, '_get', rne)
    expect(storage.copy('person', {})).toBeInstanceOf(Error)

    setObjectProperty(storage, '_has', rne)
    expect(storage.has('person')).toBeFalsy()
    setObjectProperty(storage, '_get', rne)
    setObjectProperty(storage, '_has', () => true)
    expect(storage.has('person', [])).toBeFalsy()
    copyObjectProperty(backup, '_get', storage)
    copyObjectProperty(backup, '_has', storage)

    Configuration.module.tcp.log = true
  })
})
