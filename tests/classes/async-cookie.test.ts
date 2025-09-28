import { beforeEach, describe, expect, it } from 'vitest'
import { AsyncCookie, cloneObject, copyObjectProperty, omitObjectProperties, rne, rv, setObjectProperty } from '../../src'
import { Configuration } from '../../src/classes/configuration'
import { CookieItem } from '../../src/definitions/interfaces'

describe('AsyncCookie', () => {
  let map: Map<string, any>, cookie: AsyncCookie

  beforeEach(() => {
    map = new Map()
    cookie = new AsyncCookie(
      'TestCookie',
      async () => map.clear(),
      async (key: string) => map.get(key),
      async (key: string) => map.has(key),
      async (key: string, keys?: any[]) => {
        if (keys?.length) {
          let item: CookieItem | null

          item = map.get(key)
          if (!item) return

          item = omitObjectProperties(item, keys)
          map.set(key, item)

          return
        }

        return rv(() => map.delete(key))
      },
      async (key: string, value: CookieItem) => rv(() => map.set(key, value))
    )
  })

  it('sets and gets an item', async () => {
    await cookie.set('person', { name: 'john' })
    expect(await cookie.get('person')).toStrictEqual({ name: 'john' })

    await cookie.set('person', { name: 'robert', surname: 'smith' }, ['surname'])
    expect(await cookie.get('person')).toStrictEqual({ name: 'john', surname: 'smith' })
  })

  it('removes an item', async () => {
    await cookie.set('person', { name: 'john', surname: 'doe' })
    expect(await cookie.has('person')).toBeTruthy()

    await cookie.remove('person', ['name'])
    expect(await cookie.has('person', ['name'])).toBeFalsy()
    expect(await cookie.has('person', ['surname'])).toBeTruthy()

    await cookie.remove('person')
    expect(await cookie.has('person')).toBeFalsy()
  })

  it('copies an item to a target object', async () => {
    let target: CookieItem

    target = {}
    await cookie.set('person', { name: 'john', surname: 'doe' })

    await cookie.copy('person', target, ['name'])
    expect(target.name).toBe('john')

    await cookie.copy('person', target, ['surname'])
    expect(target.surname).toBe('doe')

    await cookie.set('person', { name: 'robert', surname: 'smith' })
    await cookie.copy('person', target)
    expect(target.name).toBe('robert')
    expect(target.surname).toBe('smith')
  })

  it('clears all items', async () => {
    await cookie.set('p1', { name: 'john' })
    await cookie.set('p2', { name: 'robert' })

    expect(await cookie.has('p1')).toBeTruthy()
    expect(await cookie.has('p2')).toBeTruthy()

    await cookie.clear()

    expect(await cookie.has('p1')).toBeFalsy()
    expect(await cookie.has('p2')).toBeFalsy()
  })

  it('handles errors from internal methods', async () => {
    let backup: AsyncCookie

    backup = cloneObject(cookie)

    Configuration.functions.tcp.log = false

    setObjectProperty(cookie, '_clear', rne)
    expect(await cookie.clear()).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_clear', cookie)

    setObjectProperty(cookie, '_get', rne)
    expect(await cookie.get('person')).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', cookie)

    setObjectProperty(cookie, '_has', rne)
    expect(await cookie.has('person')).toBeFalsy()
    copyObjectProperty(backup, '_has', cookie)

    setObjectProperty(cookie, '_remove', rne)
    expect(await cookie.remove('person')).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', cookie)
    copyObjectProperty(backup, '_remove', cookie)
    copyObjectProperty(backup, '_set', cookie)

    setObjectProperty(cookie, '_set', rne)
    expect(await cookie.set('person', { name: 'john' })).toBeInstanceOf(Error)
    setObjectProperty(cookie, '_get', rne)
    expect(await cookie.set('person', { name: 'john' }, ['name'])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', cookie)
    copyObjectProperty(backup, '_set', cookie)

    setObjectProperty(cookie, '_get', rne)
    expect(await cookie.copy('person', {})).toBeUndefined()

    setObjectProperty(cookie, '_has', rne)
    expect(await cookie.has('person')).toBeFalsy()
    setObjectProperty(cookie, '_get', rne)
    setObjectProperty(cookie, '_has', () => true)
    expect(await cookie.has('person', [])).toBeFalsy()
    copyObjectProperty(backup, '_get', cookie)
    copyObjectProperty(backup, '_has', cookie)

    Configuration.functions.tcp.log = true
  })
})
