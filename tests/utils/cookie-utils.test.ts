import { describe, expect, it } from 'vitest'
import { deserializeCookie } from '../../src'
import { Configuration } from '../../src/classes/configuration'

describe('Cookie Utils', () => {
  it('returns an error if deserialize fails', () => {
    Configuration.functions.tc.log = false
    expect(deserializeCookie(0 as any)).toBeInstanceOf(Error)
    Configuration.functions.tc.log = true
  })
})
