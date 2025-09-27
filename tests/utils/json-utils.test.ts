import { beforeEach, describe, expect, it } from 'vitest'
import { decodeJSON, encodeJSON } from '../../src/utils/json-utils'

interface Reference {
  bigint: bigint | number
  bigint_str: bigint | number | string
  float: number
  float_str: number | string
  int: number
  int_str: number | string
}

describe('JSON Utils', () => {
  let ref: Reference

  beforeEach(() => {
    ref = {
      bigint: Number.MAX_SAFE_INTEGER + 1,
      bigint_str: BigInt(Number.MAX_SAFE_INTEGER + 1).toString(),
      float: 0.1,
      float_str: '0.1',
      int: 0,
      int_str: '0'
    }
  })

  it('encodes and decodes JSON', () => {
    let encoded: string | Error, decoded: Reference | Error

    encoded = encodeJSON(ref)
    if (encoded instanceof Error) throw encoded

    decoded = decodeJSON(encoded)
    if (decoded instanceof Error) throw decoded

    expect(decoded).toStrictEqual(ref)
  })

  it('decodes JSON casting bigint strings to bigint', () => {
    let encoded: string | Error, decoded: Reference | Error

    encoded = encodeJSON(ref)
    if (encoded instanceof Error) throw encoded

    decoded = decodeJSON(encoded, { castBigIntStringToBigInt: true })
    if (decoded instanceof Error) throw decoded

    expect(decoded).toStrictEqual({ ...ref, bigint_str: BigInt(ref.bigint_str) })
  })

  it('decodes JSON casting float strings to number', () => {
    let encoded: string | Error, decoded: Reference | Error

    encoded = encodeJSON(ref)
    if (encoded instanceof Error) throw encoded

    decoded = decodeJSON(encoded, { castFloatStringToNumber: true })
    if (decoded instanceof Error) throw decoded

    expect(decoded).toStrictEqual({ ...ref, float_str: Number(ref.float_str) })

    ref.float_str = '.1'

    decoded = decodeJSON(encodeJSON(ref, {}, '{}'), { castFloatStringToNumber: true })
    if (decoded instanceof Error) throw decoded

    expect(decoded).toStrictEqual({ ...ref, float_str: 0.1 })
  })

  it('decodes JSON casting int strings to number', () => {
    let encoded: string | Error, decoded: Reference | Error

    encoded = encodeJSON(ref)
    if (encoded instanceof Error) throw encoded

    decoded = decodeJSON(encoded, { castIntStringToNumber: true })
    if (decoded instanceof Error) throw decoded

    expect(decoded).toStrictEqual({ ...ref, int_str: Number(ref.int_str) })

    ref.int_str = '1.'

    decoded = decodeJSON(encodeJSON(ref, {}, '{}'), { castIntStringToNumber: true })
    if (decoded instanceof Error) throw decoded

    expect(decoded).toStrictEqual({ ...ref, int_str: 1 })
  })

  it('decodes JSON casting unsafe int to bigint', () => {
    let encoded: string | Error, decoded: Reference | Error

    encoded = encodeJSON(ref)
    if (encoded instanceof Error) throw encoded

    decoded = decodeJSON(encoded, { castUnsafeIntToBigInt: true })
    if (decoded instanceof Error) throw decoded

    expect(decoded).toStrictEqual({ ...ref, bigint: BigInt(ref.bigint) })
  })

  it('encodes like JSON.stringify with default options', () => {
    let encoded: string | Error

    encoded = encodeJSON(ref)
    if (encoded instanceof Error) throw encoded

    expect(encoded).toStrictEqual(JSON.stringify(ref))
  })

  it('decodes like JSON.parse with default options', () => {
    let decoded: Reference | Error

    decoded = decodeJSON(JSON.stringify(ref))
    if (decoded instanceof Error) throw decoded

    expect(decoded).toStrictEqual(JSON.parse(JSON.stringify(ref)))
  })
})
