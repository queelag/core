import { describe, expect, it } from 'vitest'
import { parseBigIntJSON } from '../../src/utils/json-utils'

describe('JSON Utils', () => {
  it('should parse JSON with BigInt', () => {
    let json

    json = {
      bigint: Number.MAX_SAFE_INTEGER + 1,
      float: 0.1,
      int: 0,
      str: '0'
    }

    json = parseBigIntJSON(JSON.stringify(json))

    expect(json.bigint).toBe(BigInt(Number.MAX_SAFE_INTEGER) + 1n)
    expect(json.float).toBe(0.1)
    expect(json.int).toBe(0)
    expect(json.str).toBe('0')
  })
})
