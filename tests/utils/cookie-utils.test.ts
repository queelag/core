import { describe, expect, it } from 'vitest'
import { deserializeCookie } from '../../src'
import { Configuration } from '../../src/classes/configuration'

describe('Cookie Utils', () => {
  it('returns an empty object if deserialize fails', () => {
    Configuration.functions.tc.log = false
    expect(deserializeCookie(0 as any)).toStrictEqual({})
    Configuration.functions.tc.log = true
  })
})
