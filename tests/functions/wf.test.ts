import { describe, expect, it } from 'vitest'
import { tne, wf } from '../../src'

describe('wf', () => {
  it('waits for fn to be truthy', async () => {
    expect(await wf(() => false, undefined, 200)).toBeInstanceOf(Error)
    expect(await wf(() => true)).toBeUndefined()
  })

  it('returns early if fn throws', async () => {
    expect(await wf(() => tne())).toBeInstanceOf(Error)
  })
})
