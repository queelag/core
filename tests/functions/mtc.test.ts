import { describe, expect, it } from 'vitest'
import { mtc } from '../../src'
import { Configuration } from '../../src/classes/configuration'

describe('mtc', () => {
  it('makes function try caught', () => {
    Configuration.functions.tc.log = false
    expect(
      mtc(() => {
        throw new Error()
      })()
    ).toBeInstanceOf(Error)
    Configuration.functions.tc.log = true
  })
})
