import { convertFormDataToObject } from '../../src'

describe('FormData', () => {
  it('converts form data to object', () => {
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

    expect(convertFormDataToObject(data)).toStrictEqual({
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
})
