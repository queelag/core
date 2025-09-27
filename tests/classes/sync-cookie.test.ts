import { beforeEach, describe, expect, it } from 'vitest'
import { Configuration } from '../../src/classes/configuration'
import { SyncCookie } from '../../src/classes/sync-cookie'
import { CookieItem } from '../../src/definitions/interfaces'
import { rne } from '../../src/functions/rne'
import { rv } from '../../src/functions/rv'
import { cloneObject, copyObjectProperty, setObjectProperty } from '../../src/utils/object-utils'

describe('SyncCookie', () => {
  let map: Map<string, any>, cookie: SyncCookie

  beforeEach(() => {
    map = new Map()
    cookie = new SyncCookie(
      'TestCookie',
      () => map.clear(),
      (key: string) => map.get(key),
      (key: string) => map.has(key),
      (key: string) => rv(() => map.delete(key)),
      (key: string, value: CookieItem) => rv(() => map.set(key, value))
    )
  })

  it('sets and gets an item', () => {
    cookie.set('person', { name: 'john' })
    expect(cookie.get('person')).toStrictEqual({ name: 'john' })

    cookie.set('person', { name: 'robert', surname: 'smith' }, ['surname'])
    expect(cookie.get('person')).toStrictEqual({ name: 'john', surname: 'smith' })
  })

  it('removes an item', () => {
    cookie.set('person', { name: 'john', surname: 'doe' })
    expect(cookie.has('person')).toBeTruthy()

    cookie.remove('person', ['name'])
    expect(cookie.has('person', ['name'])).toBeFalsy()
    expect(cookie.has('person', ['surname'])).toBeTruthy()

    cookie.remove('person')
    expect(cookie.has('person')).toBeFalsy()
  })

  it('copies an item to a target object', () => {
    let target: CookieItem

    target = {}
    cookie.set('person', { name: 'john', surname: 'doe' })

    cookie.copy('person', target, ['name'])
    expect(target.name).toBe('john')

    cookie.copy('person', target, ['surname'])
    expect(target.surname).toBe('doe')

    cookie.set('person', { name: 'robert', surname: 'smith' })
    cookie.copy('person', target)
    expect(target.name).toBe('robert')
    expect(target.surname).toBe('smith')
  })

  it('clears all items', () => {
    cookie.set('p1', { name: 'john' })
    cookie.set('p2', { name: 'robert' })

    expect(cookie.has('p1')).toBeTruthy()
    expect(cookie.has('p2')).toBeTruthy()

    cookie.clear()

    expect(cookie.has('p1')).toBeFalsy()
    expect(cookie.has('p2')).toBeFalsy()
  })

  it('handles errors from internal methods', () => {
    let backup: SyncCookie

    backup = cloneObject(cookie)

    Configuration.functions.tcp.log = false

    setObjectProperty(cookie, '_clear', rne)
    expect(cookie.clear()).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_clear', cookie)

    setObjectProperty(cookie, '_get', rne)
    expect(cookie.get('person')).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', cookie)

    setObjectProperty(cookie, '_has', rne)
    expect(cookie.has('person')).toBeFalsy()
    copyObjectProperty(backup, '_has', cookie)

    setObjectProperty(cookie, '_remove', rne)
    expect(cookie.remove('person')).toBeInstanceOf(Error)
    setObjectProperty(cookie, '_set', rne)
    expect(cookie.remove('person', [])).toBeUndefined()
    setObjectProperty(cookie, '_get', rne)
    expect(cookie.remove('person', [])).toBeUndefined()
    copyObjectProperty(backup, '_get', cookie)
    copyObjectProperty(backup, '_remove', cookie)
    copyObjectProperty(backup, '_set', cookie)

    setObjectProperty(cookie, '_set', rne)
    expect(cookie.set('person', { name: 'john' })).toBeInstanceOf(Error)
    setObjectProperty(cookie, '_get', rne)
    expect(cookie.set('person', { name: 'john' }, ['name'])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', cookie)
    copyObjectProperty(backup, '_set', cookie)

    setObjectProperty(cookie, '_get', rne)
    expect(cookie.copy('person', {})).toBeUndefined()

    setObjectProperty(cookie, '_has', rne)
    expect(cookie.has('person')).toBeFalsy()
    setObjectProperty(cookie, '_get', rne)
    setObjectProperty(cookie, '_has', () => true)
    expect(cookie.has('person', [])).toBeFalsy()
    copyObjectProperty(backup, '_get', cookie)
    copyObjectProperty(backup, '_has', cookie)

    Configuration.functions.tcp.log = true
  })
})
