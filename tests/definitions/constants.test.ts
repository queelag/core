import { DEFAULT_COOKIE_TARGET } from '../../src/definitions/constants'

describe('Constants', () => {
  test('default cookie target', () => {
    global.document = global.document || { cookie: '' }

    expect(DEFAULT_COOKIE_TARGET.get()).toBe('')
    DEFAULT_COOKIE_TARGET.set('hello')
    expect(DEFAULT_COOKIE_TARGET.get()).toBe('hello')

    // @ts-ignore
    delete global.window

    expect(DEFAULT_COOKIE_TARGET.get()).toBe('')
    DEFAULT_COOKIE_TARGET.set('hello')
    expect(DEFAULT_COOKIE_TARGET.get()).toBe('')
  })
})
