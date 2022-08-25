import {
  cloneDeepObject,
  cloneShallowObject,
  convertObjectToFormData,
  deleteObjectProperty,
  getObjectProperty,
  hasObjectProperty,
  isObject,
  isObjectKeysPopulated,
  isObjectValuesPopulated,
  isPlainObject,
  mergeObjects,
  noop,
  omitObjectProperties,
  pickObjectProperties,
  Polyfill,
  setObjectProperty
} from '../../src'
import { Configuration } from '../../src/modules/configuration'

interface Object {
  do1: {
    a1: number[]
    n1: number
  }
  sbi1: bigint
  sbo1: boolean
  sf1: Function
  snul1: null
  snum1: number
  ss1: string
  su1: undefined
  sy1: symbol
}

describe('ObjectUtils', () => {
  let o1: Object, o2: Object, clone: Record<PropertyKey, any>

  beforeEach(() => {
    o1 = {
      do1: { a1: [0], n1: 0 },
      sbi1: 0n,
      sbo1: false,
      sf1: noop,
      snul1: null,
      snum1: 0,
      ss1: '',
      su1: undefined,
      sy1: Symbol(0)
    }
    o2 = cloneDeepObject(o1, false)
  })

  it('clones an object shallowly', () => {
    clone = cloneShallowObject(o1)
    expect(clone).toStrictEqual(o1)

    clone.snum1 = 1
    expect(o1.snum1).toBe(0)

    clone.do1.n1 = 1
    expect(o1.do1.n1).toBe(1)
  })

  it('clones an object deeply', () => {
    clone = cloneDeepObject(o1, false)
    expect(clone).toStrictEqual(o1)

    clone.snum1 = 1
    expect(o1.snum1).toBe(0)

    clone.do1.n1 = 1
    expect(o1.do1.n1).toBe(0)

    deleteObjectProperty(o1, 'sbi1')
    deleteObjectProperty(o1, 'sf1')
    deleteObjectProperty(o1, 'sy1')

    clone = cloneDeepObject(o1)
    expect(clone).toStrictEqual(omitObjectProperties(o1, ['su1']))

    clone.snum1 = 1
    expect(o1.snum1).toBe(0)

    clone.do1.n1 = 1
    expect(o1.do1.n1).toBe(0)
  })

  it('deletes an object property', () => {
    deleteObjectProperty(o1, 'snum1')
    expect(o1.snum1).toBeUndefined()

    deleteObjectProperty(o1, 'do1.n1')
    expect(o1.do1.n1).toBeUndefined()

    deleteObjectProperty(o1, 'do1.a1.0')
    expect(o1.do1.a1[0]).toBeUndefined()

    deleteObjectProperty(o2.do1.a1, 0)
    expect(o2.do1.a1[0]).toBeUndefined()
  })

  it('gets an object property', () => {
    expect(getObjectProperty(o1, 'snum1')).toBe(0)
    expect(getObjectProperty(o1, 'do1.n1')).toBe(0)
    expect(getObjectProperty(o1, 'do1.a1.0')).toBe(0)
    expect(getObjectProperty(o1, 'unknown')).toBeUndefined()
    expect(getObjectProperty(o1, 'unknown', null)).toBeNull()
    expect(getObjectProperty(o1.do1.a1, 0)).toBe(0)
  })

  it('merges multiple objects', () => {
    deleteObjectProperty(o1, 'sbi1')
    deleteObjectProperty(o1, 'sf1')
    deleteObjectProperty(o1, 'sy1')
    deleteObjectProperty(o2, 'sbi1')
    deleteObjectProperty(o2, 'sf1')
    deleteObjectProperty(o2, 'sy1')

    expect(mergeObjects(o1, o2)).toStrictEqual(
      omitObjectProperties(
        {
          ...o1,
          ...o2,
          do1: {
            ...o1.do1,
            ...o2.do1
          }
        },
        ['su1']
      )
    )
    expect(mergeObjects(o2, o1)).toStrictEqual(
      omitObjectProperties(
        {
          ...o2,
          ...o1,
          do1: {
            ...o2.do1,
            ...o1.do1
          }
        },
        ['su1']
      )
    )
  })

  it('omits an object properties', () => {
    expect(omitObjectProperties(o1, ['do1'])).toStrictEqual({
      sbi1: o1.sbi1,
      sbo1: o1.sbo1,
      sf1: o1.sf1,
      snul1: null,
      snum1: o1.snum1,
      ss1: '',
      sy1: o1.sy1,
      su1: undefined
    })
    expect(omitObjectProperties(o1, ['snum1'])).toStrictEqual({
      do1: o1.do1,
      sbi1: o1.sbi1,
      sbo1: o1.sbo1,
      sf1: o1.sf1,
      snul1: null,
      ss1: '',
      sy1: o1.sy1,
      su1: undefined
    })
  })

  it('picks an object properties', () => {
    expect(pickObjectProperties(o1, ['do1'])).toStrictEqual({ do1: { a1: [0], n1: 0 } })
    expect(pickObjectProperties(o1, ['snum1'])).toStrictEqual({ snum1: 0 })
  })

  it('sets an object property', () => {
    setObjectProperty(o1, 'snum1', 1)
    expect(o1.snum1).toBe(1)

    setObjectProperty(o1, 'do1.n1', 1)
    expect(o1.do1.n1).toBe(1)

    setObjectProperty(o1, 'do1.a1.0', 1)
    expect(o1.do1.a1[0]).toBe(1)

    setObjectProperty(o1.do1.a1, 0, 0)
    expect(o1.do1.a1[0]).toBe(0)

    setObjectProperty(o1, 'do2.a1.[0]', 0)
    // @ts-ignore
    expect(o1.do2.a1[0]).toBe(0)

    expect(setObjectProperty(o1, 'snum1.0', 0)).toBeInstanceOf(Error)
  })

  it('converts an object to form data', async () => {
    let data: FormData

    await Polyfill.file()

    setObjectProperty(o1, 'blob', new Blob([]))
    setObjectProperty(o1, 'file', new File([], ''))
    setObjectProperty(o1, 'do2', o1)

    Configuration.module.tc.log = false
    data = convertObjectToFormData(o1)
    Configuration.module.tc.log = true

    expect(data.get('sbi1')).toBe('0')
    expect(data.get('sbo1')).toBe('false')
    expect(data.get('blob')).toBeInstanceOf(File)
    expect(data.get('file')).toBeInstanceOf(File)
    expect(data.get('do1')).toBe(JSON.stringify(o1.do1))
    expect(data.get('do2')).toBeNull()
    expect(data.get('f1')).toBeNull()
    expect(data.get('snul1')).toBeNull()
    expect(data.get('snum1')).toBe('0')
    expect(data.get('ss1')).toBe('')
    expect(data.get('sy1')).toBeNull()
    expect(data.get('su1')).toBeNull()
  })

  it('checks if object has property', () => {
    expect(hasObjectProperty(o1, 'snum1')).toBeTruthy()
    expect(hasObjectProperty(o1, 'do1.n1')).toBeTruthy()
    expect(hasObjectProperty(o1, 'do1.a1.0')).toBeTruthy()
    expect(hasObjectProperty(o1, 'unknown')).toBeFalsy()
  })

  it('checks if an object has keys', () => {
    expect(isObjectKeysPopulated(o1)).toBeTruthy()
    expect(isObjectKeysPopulated({})).toBeFalsy()
  })

  it('checks if an object has values', () => {
    expect(isObjectValuesPopulated(o1)).toBeTruthy()
    expect(isObjectValuesPopulated({})).toBeFalsy()
  })

  it('checks if a variable is an object', () => {
    // bigint
    expect(isObject(0n)).toBeFalsy()
    // boolean
    expect(isObject(false)).toBeFalsy()
    // function
    expect(isObject(() => undefined)).toBeFalsy()
    // null
    expect(isObject(null)).toBeFalsy()
    // number
    expect(isObject(0)).toBeFalsy()
    // object
    expect(isObject({})).toBeTruthy()
    // string
    expect(isObject('')).toBeFalsy()
    // symbol
    expect(isObject(Symbol())).toBeFalsy()
    // undefined
    expect(isObject(undefined)).toBeFalsy()

    // array
    expect(isObject([])).toBeFalsy()
  })

  it('checks if a variable is a plain object', () => {
    // bigint
    expect(isPlainObject(0n)).toBeFalsy()
    // boolean
    expect(isPlainObject(false)).toBeFalsy()
    // function
    expect(isPlainObject(() => undefined)).toBeFalsy()
    // null
    expect(isPlainObject(null)).toBeFalsy()
    // number
    expect(isPlainObject(0)).toBeFalsy()
    // object
    expect(isPlainObject({})).toBeTruthy()
    // string
    expect(isPlainObject('')).toBeFalsy()
    // symbol
    expect(isPlainObject(Symbol())).toBeFalsy()
    // undefined
    expect(isPlainObject(undefined)).toBeFalsy()

    // array
    expect(isPlainObject([])).toBeFalsy()
    // date
    expect(isPlainObject(new Date())).toBeFalsy()
    // map
    expect(isPlainObject(new Map())).toBeFalsy()
    // set
    expect(isPlainObject(new Set())).toBeFalsy()
  })
})
