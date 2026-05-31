import { describe, expect, it } from 'vitest'
import { ma, noop } from '../../src'

describe('ma', () => {
  it('makes function async', () => {
    expect(ma(noop)()).toBeInstanceOf(Promise)
  })
})
