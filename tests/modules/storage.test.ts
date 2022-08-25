import { cloneShallowObject, copyObjectProperty, rv, setObjectProperty, Storage, tne } from '../../src'
import { StorageValue } from '../../src/definitions/interfaces'
import { Configuration } from '../../src/modules/configuration'

describe('Storage', () => {
  let map: Map<string, any>, storage: Storage

  beforeAll(() => {
    map = new Map()
    storage = new Storage(
      'MockStorage',
      async () => map.clear(),
      async (key: string) => map.get(key),
      async (key: string) => map.has(key),
      async (key: string) => rv(() => map.delete(key)),
      async (key: string, value: StorageValue) => rv(() => map.set(key, value))
    )
  })

  beforeEach(() => {
    map.clear()
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
    let target: StorageValue

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

  it('handles errors from private methods', async () => {
    let backup: Storage

    backup = cloneShallowObject(storage)

    Configuration.module.tcp.log = false

    setObjectProperty(storage, '_clear', tne)
    expect(await storage.clear()).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_clear', storage)

    setObjectProperty(storage, '_get', tne)
    expect(await storage.get('person')).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', storage)

    setObjectProperty(storage, '_has', tne)
    expect(await storage.has('person')).toBeFalsy()
    copyObjectProperty(backup, '_has', storage)

    setObjectProperty(storage, '_remove', tne)
    expect(await storage.remove('person')).toBeInstanceOf(Error)
    setObjectProperty(storage, '_set', tne)
    expect(await storage.remove('person', [])).toBeInstanceOf(Error)
    setObjectProperty(storage, '_get', tne)
    expect(await storage.remove('person', [])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', storage)
    copyObjectProperty(backup, '_remove', storage)
    copyObjectProperty(backup, '_set', storage)

    setObjectProperty(storage, '_set', tne)
    expect(await storage.set('person', { name: 'john' })).toBeInstanceOf(Error)
    setObjectProperty(storage, '_get', tne)
    expect(await storage.set('person', { name: 'john' }, ['name'])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', storage)
    copyObjectProperty(backup, '_set', storage)

    setObjectProperty(storage, '_get', tne)
    expect(await storage.copy('person', {})).toBeInstanceOf(Error)

    setObjectProperty(storage, '_has', tne)
    expect(await storage.has('person')).toBeFalsy()
    setObjectProperty(storage, '_get', tne)
    setObjectProperty(storage, '_has', () => true)
    expect(await storage.has('person', [])).toBeFalsy()
    copyObjectProperty(backup, '_get', storage)
    copyObjectProperty(backup, '_has', storage)

    Configuration.module.tcp.log = true
  })
})
