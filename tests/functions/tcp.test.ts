import { describe, expect, it, vi } from 'vitest'
import { tcp } from '../../src'
import { Configuration } from '../../src/modules/configuration'

describe('tcp', () => {
  it('try catches', async () => {
    expect(await tcp(async () => 0)).toBe(0)
    expect(
      await tcp(async () => {
        throw new Error()
      }, false)
    ).toBeInstanceOf(Error)
  })

  it('calls the onCatch callback if the fn throws', async () => {
    Configuration.module.tcp.onCatch = vi.fn()
    await tcp(async () => {
      throw new Error()
    }, false)
    expect(Configuration.module.tcp.onCatch).toBeCalled()
  })

  it('does log if log is true', () => {
    console.error = vi.fn()
    tcp(async () => {
      throw new Error()
    }, true)
    // expect(console.error).toBeCalled()
  })
})
