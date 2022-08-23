import { Cookie } from '../../src'
import { CookieObject } from '../../src/definitions/interfaces'
import { Configuration } from '../../src/modules/configuration'

interface TestCookie {
  a?: number
  b?: number
}

describe('Cookie', () => {
  let cookie: Map<string, string>

  beforeEach(() => {
    cookie = new Map()

    Cookie.target = {
      get: () => [...cookie.entries()].map(([k, v]) => [k, v].join('=')).join(';'),
      set: (string: string) => {
        let object: CookieObject | Error

        object = Cookie.parse(string)
        if (object instanceof Error) return

        for (let k in object) {
          cookie.set(k, object[k])
        }
      }
    }
  })

  it('sets and gets', () => {
    Cookie.set<TestCookie>('test', { a: 0 })
    expect(Cookie.get<TestCookie>('test')).toMatchObject({ a: '0' })
  })

  it('removes all keys or single keys', () => {
    Cookie.set<TestCookie>('test', { a: 0, b: 0 })
    expect(Cookie.get<TestCookie>('test')).toMatchObject({ a: '0', b: '0' })

    Cookie.remove<TestCookie>('test', ['a'])
    expect(Cookie.get<TestCookie>('test')).toMatchObject({ b: '0' })

    Cookie.remove<TestCookie>('test')
    expect(Cookie.get<TestCookie>('test')).toMatchObject({})
  })

  it('fails to parse', () => {
    jest.spyOn(Cookie, 'parse').mockImplementationOnce(() => new Error())
    expect(Cookie.get('test')).toBeInstanceOf(Error)

    jest.spyOn(Cookie, 'parse').mockImplementationOnce(() => new Error())
    expect(Cookie.remove('test')).toBeInstanceOf(Error)
  })

  it('fails to serialize', () => {
    Configuration.module.tc.log = false
    expect(Cookie.set('test', { a: 0 }, { maxAge: NaN })).toBeInstanceOf(Error)
    Configuration.module.tc.log = false

    jest.spyOn(Cookie, 'serialize').mockImplementationOnce(() => new Error())
    expect(Cookie.remove('test', ['a'])).toBeInstanceOf(Error)
  })
})
