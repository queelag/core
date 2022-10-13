import { describe, expect, it } from 'vitest'
import { noop } from '../../src'

describe('noop', () => {
  it('returns void', () => {
    expect(noop()).toBeUndefined()
  })
})
