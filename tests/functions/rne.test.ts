import { describe, expect, it } from 'vitest'
import { rne } from '../../src'

describe('rne', () => {
  it('returns new error', () => {
    expect(rne()).toBeInstanceOf(Error)
  })
})
