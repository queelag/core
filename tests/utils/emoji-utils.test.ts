import { describe, expect, it } from 'vitest'
import { getEmojiFromCountryCode } from '../../src'

describe('Emoji', () => {
  it('derives flag from country code', () => {
    expect(getEmojiFromCountryCode('gb')).toBe('🇬🇧')
    expect(getEmojiFromCountryCode('it')).toBe('🇮🇹')
  })
})
