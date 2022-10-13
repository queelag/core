import { beforeEach, describe, expect, it } from 'vitest'
import { cloneDeepObject, Cookie, copyObjectProperty, getObjectProperty, ma, noop, rne, setObjectProperty } from '../../src'
import { CookieItem } from '../../src/definitions/interfaces'
import { STUB_COOKIE_GET, STUB_COOKIE_SET } from '../../src/definitions/stubs'
import { Configuration } from '../../src/modules/configuration'

interface TestCookie extends CookieItem {
  a?: number
  b?: number
}

describe('Cookie', () => {
  let map: Map<string, string>, cookie: Cookie

  beforeEach(async () => {
    map = new Map()
    cookie = new Cookie('TestCookie', ma(STUB_COOKIE_GET(map)), ma(STUB_COOKIE_SET(map)))

    await cookie.set('interference', { a: 0 })
  })

  it('clears', async () => {
    await cookie.set('test1', { a: 0 })
    await cookie.set('test2', { b: 0 })
    expect(await cookie.has('test1')).toBeTruthy()
    expect(await cookie.has('test2')).toBeTruthy()

    await cookie.clear()
    expect(await cookie.has('test1')).toBeFalsy()
    expect(await cookie.has('test2')).toBeFalsy()
  })

  it('sets and gets', async () => {
    await cookie.set<TestCookie>('test', { a: 0 })
    expect(await cookie.get<TestCookie>('test')).toMatchObject({ a: '0' })
  })

  it('removes all keys or single keys', async () => {
    await cookie.set<TestCookie>('test', { a: 0, b: 0 })
    expect(await cookie.has<TestCookie>('test')).toBeTruthy()

    await cookie.remove<TestCookie>('test', ['a'])
    expect(await cookie.has<TestCookie>('test', ['a'])).toBeFalsy()
    expect(await cookie.has<TestCookie>('test', ['b'])).toBeTruthy()

    await cookie.remove<TestCookie>('test')
    expect(await cookie.has<TestCookie>('test')).toBeFalsy()
  })

  it('copies an item to a target object', async () => {
    let target: CookieItem

    target = {}
    await cookie.set<TestCookie>('test', { a: 0, b: 0 })

    await cookie.copy<TestCookie>('test', target, ['a'])
    expect(target.a).toBe('0')

    await cookie.copy<TestCookie>('test', target, ['b'])
    expect(target.b).toBe('0')

    await cookie.set<TestCookie>('test', { a: 1, b: 1 })
    await cookie.copy<TestCookie>('test', target)
    expect(target.a).toBe('1')
    expect(target.b).toBe('1')
  })

  it('fails to parse', async () => {
    let deserialize: Function

    deserialize = getObjectProperty(cookie, 'deserialize', noop)
    setObjectProperty(cookie, 'deserialize', () => new Error())

    expect(await cookie.clear()).toBeInstanceOf(Error)
    expect(await cookie.copy('test', {})).toBeInstanceOf(Error)
    expect(await cookie.get('test')).toBeInstanceOf(Error)
    expect(await cookie.remove('test')).toBeInstanceOf(Error)
    expect(await cookie.has('test')).toBeFalsy()

    setObjectProperty(cookie, 'deserialize', deserialize)
  })

  it('fails to serialize', async () => {
    let serialize: Function

    Configuration.module.tc.log = false
    expect(await cookie.set('test', { a: 0 }, { maxAge: NaN })).toBeInstanceOf(Error)
    Configuration.module.tc.log = false

    serialize = getObjectProperty(cookie, 'serialize', noop)
    setObjectProperty(cookie, 'serialize', () => new Error())

    expect(await cookie.remove('test', ['a'])).toBeInstanceOf(Error)
    expect(await cookie.clear()).toBeInstanceOf(Error)

    setObjectProperty(cookie, 'serialize', serialize)
  })

  it('handles errors from internal methods', async () => {
    let backup: Cookie

    backup = cloneDeepObject(cookie)

    Configuration.module.tcp.log = false

    setObjectProperty(cookie, '_set', rne)
    expect(await cookie.clear()).toBeInstanceOf(Error)
    expect(await cookie.remove<TestCookie>('test', ['a'])).toBeInstanceOf(Error)
    expect(await cookie.set<TestCookie>('test', { a: 0 }, undefined, ['a'])).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_set', cookie)

    setObjectProperty(cookie, '_get', rne)
    expect(await cookie.clear()).toBeInstanceOf(Error)
    copyObjectProperty(backup, '_get', cookie)

    Configuration.module.tcp.log = true
  })
})
