import { randomBytes } from 'crypto'
import { describe, expect, it } from 'vitest'
import { ID } from '../../src'
import { ID_ALPHABET_NUMBERS } from '../../src/definitions/constants'

describe('ID', () => {
  it('generates', () => {
    expect(ID.generate()).toMatch(/[a-zA-Z0-9]{32}/)
  })

  it('generates with a prefix, suffix and custom separator', () => {
    expect(ID.generate({ prefix: 'prefix' })).toMatch(/prefix_[a-zA-Z0-9]{32}/)
    expect(ID.generate({ suffix: 'suffix' })).toMatch(/[a-zA-Z0-9]{32}_suffix/)
    expect(ID.generate({ prefix: 'prefix', suffix: 'suffix' })).toMatch(/prefix_[a-zA-Z0-9]{32}_suffix/)
    expect(ID.generate({ prefix: 'prefix', separator: '-', suffix: 'suffix' })).toMatch(/prefix-[a-zA-Z0-9]{32}-suffix/)
  })

  it('generates with a custom alphabet', () => {
    expect(ID.generate({ alphabet: ID_ALPHABET_NUMBERS })).toMatch(/[0-9]{32}/)
  })

  it('generates with a custom random bytes generator', () => {
    expect(ID.generate({ random: (bytes: number) => randomBytes(bytes) })).toMatch(/[a-zA-Z0-9]{32}/)
  })

  it('generates with a custom size', () => {
    expect(ID.generate({ size: 16 })).toMatch(/[a-zA-Z0-9]{16}/)
  })

  it('generates without collisions', () => {
    let id: string

    ID.random = (bytes: number) => new Uint8Array(bytes).fill(Math.round(Math.random()))
    id = ID.generate()

    expect(ID.generate({ blacklist: [id] })).not.toBe(id)
  })
})
