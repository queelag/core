import { beforeEach, describe, expect, it } from 'vitest'
import { Cookie, cloneDeepObject, copyObjectProperty, getObjectProperty, noop, rne, setObjectProperty } from '../../src'
import { Configuration } from '../../src/classes/configuration'
import { CookieItem } from '../../src/definitions/interfaces'
import { STUB_COOKIE_GET, STUB_COOKIE_SET } from '../../src/definitions/stubs'

interface TestCookie extends CookieItem {
  a?: number
  b?: number
}

describe('Cookie', () => {
  let map: Map<string, string>, cookie: Cookie

  beforeEach(() => {
    map = new Map()
    cookie = new Cookie('TestCookie', STUB_COOKIE_GET(map), STUB_COOKIE_SET(map))

    cookie.set('interference', { a: 0 })
  })

  it('clears', () => {
    cookie.set('test1', { a: 0 })
    cookie.set('test2', { b: 0 })
    expect(cookie.has('test1')).toBeTruthy()
    expect(cookie.has('test2')).toBeTruthy()

    cookie.clear()
    expect(cookie.has('test1')).toBeFalsy()
    expect(cookie.has('test2')).toBeFalsy()
  })

  it('sets and gets', () => {
    cookie.set<TestCookie>('test', { a: 0 })
    expect(cookie.get<TestCookie>('test')).toMatchObject({ a: '0' })
  })

  it('removes all keys or single keys', () => {
    cookie.set<TestCookie>('test', { a: 0, b: 0 })
    expect(cookie.has<TestCookie>('test')).toBeTruthy()

    cookie.remove<TestCookie>('test', {}, ['a'])
    expect(cookie.has<TestCookie>('test', ['a'])).toBeFalsy()
    expect(cookie.has<TestCookie>('test', ['b'])).toBeTruthy()

    cookie.remove<TestCookie>('test')
    expect(cookie.has<TestCookie>('test')).toBeFalsy()
  })

  it('copies an item to a target object', () => {
    let target: CookieItem

    target = {}
    cookie.set<TestCookie>('test', { a: 0, b: 0 })

    cookie.copy<TestCookie>('test', target, ['a'])
    expect(target.a).toBe('0')

    cookie.copy<TestCookie>('test', target, ['b'])
    expect(target.b).toBe('0')

    cookie.set<TestCookie>('test', { a: 1, b: 1 })
    cookie.copy<TestCookie>('test', target)
    expect(target.a).toBe('1')
    expect(target.b).toBe('1')
  })

  it('fails to parse', () => {
    let deserialize: Function

    deserialize = getObjectProperty(cookie, 'deserialize', noop)
    setObjectProperty(cookie, 'deserialize', () => new Error())

    expect(cookie.clear()).toBeInstanceOf(Error)
    expect(cookie.copy('test', {})).toBeInstanceOf(Error)
    expect(cookie.get('test')).toBeInstanceOf(Error)
    expect(cookie.remove('test')).toBeInstanceOf(Error)
    expect(cookie.has('test')).toBeFalsy()

    setObjectProperty(cookie, 'deserialize', deserialize)
  })

  it('fails to serialize', () => {
    let serialize: Function

    Configuration.module.tc.log = false
    expect(cookie.set('test', { a: 0 }, { maxAge: NaN })).toBeInstanceOf(Error)
    Configuration.module.tc.log = false

    serialize = getObjectProperty(cookie, 'serialize', noop)
    setObjectProperty(cookie, 'serialize', () => new Error())

    expect(cookie.remove('test', {}, ['a'])).toBeInstanceOf(Error)
    expect(cookie.clear()).toBeInstanceOf(Error)

    setObjectProperty(cookie, 'serialize', serialize)
  })

  it('handles errors from internal methods', () => {
    let backup: Cookie

    backup = cloneDeepObject(cookie)

    Configuration.module.tcp.log = false

    setObjectProperty(cookie, '_set', rne)
    expect(cookie.clear()).toBeInstanceOf(Error)
    expect(cookie.remove<TestCookie>('test', {}, ['a'])).toBeInstanceOf(Error)
    expect(cookie.set<TestCookie>('test', { a: 0 }, undefined, ['a'])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_set', cookie)

    setObjectProperty(cookie, '_get', rne)
    expect(cookie.clear()).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', cookie)

    Configuration.module.tcp.log = true
  })
})
