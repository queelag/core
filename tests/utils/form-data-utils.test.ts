import { beforeAll, describe, expect, it } from 'vitest'
import { deserializeFormData, noop, serializeFormData, useNodeFetch } from '../../src'
import { Configuration } from '../../src/modules/configuration'

describe('FormData', () => {
  beforeAll(async () => {
    await useNodeFetch(await import('node-fetch'))
  })

  it('deserializes form data to object', () => {
    let data: FormData

    data = new FormData()
    data.append('bigint', BigInt(0).toString())
    // data.append('blob', new Blob([]))
    data.append('boolean', `${true}`)
    data.append('null', `${null}`)
    data.append('number', Number(0).toString())
    data.append('object', JSON.stringify({ a: 0 }))
    data.append('string', 'string')
    data.append('symbol', Symbol().toString())
    data.append('undefined', `${undefined}`)

    expect(deserializeFormData(data)).toStrictEqual({
      bigint: 0,
      //   blob: new Blob([]),
      boolean: true,
      null: null,
      number: 0,
      object: { a: 0 },
      string: 'string',
      symbol: 'Symbol()',
      undefined: 'undefined'
    })
  })

  it('serializes an object to form data', async () => {
    let object: Record<PropertyKey, any>, data: FormData

    await useNodeFetch(await import('node-fetch'))

    object = {
      do1: { a1: [0], n1: 0, s1: '' },
      sbi1: 0n,
      sbo1: false,
      sf1: noop,
      snul1: null,
      snum1: 0,
      ss1: '',
      su1: undefined,
      sy1: Symbol(0)
    }
    object.blob = new Blob()
    object.file = new File([], '')
    object.do2 = object

    Configuration.module.tc.log = false
    data = serializeFormData(object)
    Configuration.module.tc.log = true

    expect(data.get('sbi1')).toBe('0')
    expect(data.get('sbo1')).toBe('false')
    expect(data.get('blob')).toBeInstanceOf(File)
    expect(data.get('file')).toBeInstanceOf(File)
    expect(data.get('do1')).toBe(JSON.stringify(object.do1))
    expect(data.get('do2')).toBeNull()
    expect(data.get('f1')).toBeNull()
    expect(data.get('snul1')).toBeNull()
    expect(data.get('snum1')).toBe('0')
    expect(data.get('ss1')).toBe('')
    expect(data.get('sy1')).toBeNull()
    expect(data.get('su1')).toBeNull()
  })
})
