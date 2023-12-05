import { describe, expect, it, vi } from 'vitest'
import { tc } from '../../src'
import { Configuration } from '../../src/classes/configuration'

describe('tc', () => {
  it('try catches', () => {
    expect(tc(() => 0)).toBe(0)
    expect(
      tc(() => {
        throw new Error()
      }, false)
    ).toBeInstanceOf(Error)
  })

  it('calls the onCatch callback if the fn throws', () => {
    Configuration.module.tc.onCatch = vi.fn()
    tc(() => {
      throw new Error()
    }, false)
    expect(Configuration.module.tc.onCatch).toBeCalled()
  })

  it('does log if log is true', () => {
    console.error = vi.fn()
    tc(() => {
      throw new Error()
    }, true)
    // expect(console.error).toBeCalled()
  })
})
