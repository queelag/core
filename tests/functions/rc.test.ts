import { describe, expect, it } from 'vitest'
import { rc } from '../../src'

describe('rc', () => {
  it('returns the custom value', () => {
    expect(rc(() => 0, 1)).toBe(1)
  })
})
