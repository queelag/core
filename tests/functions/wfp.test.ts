import { describe, expect, it } from 'vitest'
import { tne, wfp } from '../../src'

describe('wfp', () => {
  it('waits for fn to be truthy', async () => {
    expect(await wfp(async () => false, undefined, 200)).toBeInstanceOf(Error)
    expect(await wfp(async () => true)).toBeUndefined()
  })

  it('returns early if fn throws', async () => {
    expect(await wfp(async () => tne())).toBeInstanceOf(Error)
  })
})
