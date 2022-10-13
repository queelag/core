import { describe, expect, it } from 'vitest'
import { rv } from '../../src'

describe('rv', () => {
  it('returns void', () => {
    expect(rv(() => 0)).toBeUndefined()
  })
})
