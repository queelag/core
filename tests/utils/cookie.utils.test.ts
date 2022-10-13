import { describe, expect, it } from 'vitest'
import { deserializeCookie } from '../../src'
import { Configuration } from '../../src/modules/configuration'

describe('CookieUtils', () => {
  it('returns an empty object if deserialize fails', () => {
    Configuration.module.tc.log = false
    expect(deserializeCookie(0 as any)).toStrictEqual({})
    Configuration.module.tc.log = true
  })
})
