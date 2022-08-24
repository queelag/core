import {
  cloneDeepObject,
  cloneShallowObject,
  convertObjectToFormData,
  deleteObjectProperty,
  getObjectProperty,
  mergeObjects,
  noop,
  omitObjectProperties,
  pickObjectProperties,
  setObjectProperty
} from '../../src'

describe('ObjectUtils', () => {
  let o1: Record<PropertyKey, any>, o2: Record<PropertyKey, any>, clone: Record<PropertyKey, any>

  beforeEach(() => {
    o1 = {
      do1: { a1: [0], n1: 0 },
      sbi1: 0n,
      sbo1: false,
      sf1: noop,
      sn1: 0,
      sy1: Symbol(0)
    }
    o2 = {
      do1: { a1: [1], a2: [1], n2: 1 },
      sbi1: 1n,
      sbo1: true,
      sf1: noop,
      sn1: 1,
      sy1: Symbol(1)
    }
    clone = {}
  })

  it('clones an object shallowly', () => {
    clone = cloneShallowObject(o1)
    expect(clone).toStrictEqual(o1)

    clone.sn1 = 1
    expect(o1.sn1).toBe(0)

    clone.do1.n1 = 1
    expect(o1.do1.n1).toBe(1)
  })

  it('clones an object deeply', () => {
    delete o1.sbi1
    delete o1.sf1
    delete o1.sy1

    clone = cloneDeepObject(o1)
    expect(clone).toStrictEqual(o1)

    clone.sn1 = 1
    expect(o1.sn1).toBe(0)

    clone.do1.n1 = 1
    expect(o1.do1.n1).toBe(0)
  })

  it('deletes an object property', () => {
    deleteObjectProperty(o1, 'sn1')
    expect(o1.sn1).toBeUndefined()

    deleteObjectProperty(o1, 'do1.n1')
    expect(o1.do1.n1).toBeUndefined()

    deleteObjectProperty(o1, 'do1.a1.0')
    expect(o1.do1.a1[0]).toBeUndefined()
  })

  it('gets an object property', () => {
    expect(getObjectProperty(o1, 'sn1')).toBe(0)
    expect(getObjectProperty(o1, 'do1.n1')).toBe(0)
    expect(getObjectProperty(o1, 'do1.a1.0')).toBe(0)
    expect(getObjectProperty(o1, 'unknown')).toBeUndefined()
    expect(getObjectProperty(o1, 'unknown', null)).toBeNull()
  })

  it('merges multiple objects', () => {
    delete o1.sbi1
    delete o1.sf1
    delete o1.sy1
    delete o2.sbi1
    delete o2.sf1
    delete o2.sy1

    expect(mergeObjects(o1, o2)).toStrictEqual({
      ...o1,
      ...o2,
      do1: {
        ...o1.do1,
        ...o2.do1
      }
    })
    expect(mergeObjects(o2, o1)).toStrictEqual({
      ...o2,
      ...o1,
      do1: {
        ...o2.do1,
        ...o1.do1
      }
    })
  })

  it('omits an object properties', () => {
    expect(omitObjectProperties(o1, ['do1'])).toStrictEqual({
      sbi1: o1.sbi1,
      sbo1: o1.sbo1,
      sf1: o1.sf1,
      sn1: o1.sn1,
      sy1: o1.sy1
    })
    expect(omitObjectProperties(o1, ['sn1'])).toStrictEqual({
      do1: o1.do1,
      sbi1: o1.sbi1,
      sbo1: o1.sbo1,
      sf1: o1.sf1,
      sy1: o1.sy1
    })
  })

  it('picks an object properties', () => {
    expect(pickObjectProperties(o1, ['do1'])).toStrictEqual({ do1: { a1: [0], n1: 0 } })
    expect(pickObjectProperties(o1, ['sn1'])).toStrictEqual({ sn1: 0 })
  })

  it('sets an object property', () => {
    setObjectProperty(o1, 'sn1', 1)
    expect(o1.sn1).toBe(1)

    setObjectProperty(o1, 'do1.n1', 1)
    expect(o1.do1.n1).toBe(1)

    setObjectProperty(o1, 'do1.a1.0', 1)
    expect(o1.do1.a1[0]).toBe(1)
  })

  it('converts an object to form data', () => {
    let data: FormData

    data = convertObjectToFormData(o1)
    expect(data.get('do1')).toBe(JSON.stringify(o1.do1))
    expect(data.get('sn1')).toBe('0')
  })
})
