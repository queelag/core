import { beforeEach, describe, expect, it } from 'vitest'
import { AsyncStorage, cloneObject, copyObjectProperty, rne, rv, setObjectProperty } from '../../src'
import { Configuration } from '../../src/classes/configuration'
import { StorageItem } from '../../src/definitions/interfaces'

describe('Storage', () => {
  let map: Map<string, any>, storage: AsyncStorage

  beforeEach(() => {
    map = new Map()
    storage = new AsyncStorage(
      'TestStorage',
      async () => map.clear(),
      async (key: string) => map.get(key),
      async (key: string) => map.has(key),
      async (key: string) => rv(() => map.delete(key)),
      async (key: string, value: StorageItem) => rv(() => map.set(key, value))
    )
  })

  it('sets and gets an item', async () => {
    await storage.set('person', { name: 'john' })
    expect(await storage.get('person')).toStrictEqual({ name: 'john' })

    await storage.set('person', { name: 'robert', surname: 'smith' }, ['surname'])
    expect(await storage.get('person')).toStrictEqual({ name: 'john', surname: 'smith' })
  })

  it('removes an item', async () => {
    await storage.set('person', { name: 'john', surname: 'doe' })
    expect(await storage.has('person')).toBeTruthy()

    await storage.remove('person', ['name'])
    expect(await storage.has('person', ['name'])).toBeFalsy()
    expect(await storage.has('person', ['surname'])).toBeTruthy()

    await storage.remove('person')
    expect(await storage.has('person')).toBeFalsy()
  })

  it('copies an item to a target object', async () => {
    let target: StorageItem

    target = {}
    await storage.set('person', { name: 'john', surname: 'doe' })

    await storage.copy('person', target, ['name'])
    expect(target.name).toBe('john')

    await storage.copy('person', target, ['surname'])
    expect(target.surname).toBe('doe')

    await storage.set('person', { name: 'robert', surname: 'smith' })
    await storage.copy('person', target)
    expect(target.name).toBe('robert')
    expect(target.surname).toBe('smith')
  })

  it('clears all items', async () => {
    await storage.set('p1', { name: 'john' })
    await storage.set('p2', { name: 'robert' })

    expect(await storage.has('p1')).toBeTruthy()
    expect(await storage.has('p2')).toBeTruthy()

    await storage.clear()

    expect(await storage.has('p1')).toBeFalsy()
    expect(await storage.has('p2')).toBeFalsy()
  })

  it('handles errors from internal methods', async () => {
    let backup: AsyncStorage

    backup = cloneObject(storage)

    Configuration.functions.tcp.log = false

    setObjectProperty(storage, '_clear', rne)
    expect(await storage.clear()).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_clear', storage)

    setObjectProperty(storage, '_get', rne)
    expect(await storage.get('person')).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', storage)

    setObjectProperty(storage, '_has', rne)
    expect(await storage.has('person')).toBeFalsy()
    copyObjectProperty(backup, '_has', storage)

    setObjectProperty(storage, '_remove', rne)
    expect(await storage.remove('person')).toBeInstanceOf(Error)
    setObjectProperty(storage, '_set', rne)
    expect(await storage.remove('person', [])).toBeInstanceOf(Error)
    setObjectProperty(storage, '_get', rne)
    expect(await storage.remove('person', [])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', storage)
    copyObjectProperty(backup, '_remove', storage)
    copyObjectProperty(backup, '_set', storage)

    setObjectProperty(storage, '_set', rne)
    expect(await storage.set('person', { name: 'john' })).toBeInstanceOf(Error)
    setObjectProperty(storage, '_get', rne)
    expect(await storage.set('person', { name: 'john' }, ['name'])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', storage)
    copyObjectProperty(backup, '_set', storage)

    setObjectProperty(storage, '_get', rne)
    expect(await storage.copy('person', {})).toBeInstanceOf(Error)

    setObjectProperty(storage, '_has', rne)
    expect(await storage.has('person')).toBeFalsy()
    setObjectProperty(storage, '_get', rne)
    setObjectProperty(storage, '_has', () => true)
    expect(await storage.has('person', [])).toBeFalsy()
    copyObjectProperty(backup, '_get', storage)
    copyObjectProperty(backup, '_has', storage)

    Configuration.functions.tcp.log = true
  })
})
