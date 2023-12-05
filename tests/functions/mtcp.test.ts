import { describe, expect, it } from 'vitest'
import { mtcp } from '../../src'
import { Configuration } from '../../src/classes/configuration'

describe('mtc', () => {
  it('makes async function try caught', async () => {
    Configuration.module.tcp.log = false
    expect(
      await mtcp(async () => {
        throw new Error()
      })()
    ).toBeInstanceOf(Error)
    Configuration.module.tcp.log = true
  })
})
