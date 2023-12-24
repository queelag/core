import { beforeEach, describe, expect, it } from 'vitest'
import {
  cloneObject,
  copyObjectProperty,
  deleteObjectProperties,
  deleteObjectProperty,
  flattenObject,
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
  setObjectProperty
} from '../../src'

interface Object {
  do1: {
    da1: number[]
    dnm1: number
    ds1: string
    du1: undefined
  }
  sa1: number[]
  sbi1: bigint
  sbo1: boolean
  sf1: Function
  snl1: null
  snm1: number
  ss1: string
  su1: undefined
  sy1: symbol
}

describe('Object Utils', () => {
  let o1: Object, o2: Object, clone: Record<PropertyKey, any>

  beforeEach(() => {
    o1 = {
      do1: { da1: [0], dnm1: 0, ds1: '', du1: undefined },
      sa1: [0],
      sbi1: 0n,
      sbo1: false,
      sf1: noop,
      snl1: null,
      snm1: 0,
      ss1: '',
      su1: undefined,
      sy1: Symbol(0)
    }
    o2 = cloneObject(o1, { deep: true })
  })

  it('clones an object shallowly', () => {
    clone = cloneObject(o1)
    expect(clone).toStrictEqual(o1)

    clone.snm1 = 1
    expect(o1.snm1).toBe(0)

    clone.do1.dnm1 = 1
    expect(o1.do1.dnm1).toBe(1)
  })

  it('clones an object deeply', () => {
    clone = cloneObject(o1, { deep: true })
    expect(clone).toStrictEqual(o1)

    clone.snm1 = 1
    expect(o1.snm1).toBe(0)

    clone.do1.da1[0] = 1
    expect(o1.do1.da1[0]).toBe(0)

    clone.do1.dnm1 = 1
    expect(o1.do1.dnm1).toBe(0)
  })

  it('copies an object property to another object', () => {
    o1.snm1 = 1
    copyObjectProperty(o1, 'snm1', o2)
    expect(o2.snm1).toBe(1)
  })

  it('deletes an object property', () => {
    deleteObjectProperty(o1, 'snm1')
    expect(o1.snm1).toBeUndefined()

    deleteObjectProperty(o1, 'do1.dnm1')
    expect(o1.do1.dnm1).toBeUndefined()

    deleteObjectProperty(o1, 'do1.da1.0')
    expect(o1.do1.da1[0]).toBeUndefined()

    deleteObjectProperty(o2.do1.da1, 0)
    expect(o2.do1.da1[0]).toBeUndefined()

    expect(deleteObjectProperty(o1, 'unknown.unknown')).toBeUndefined()
  })

  it('deletes object properties deeply', () => {
    deleteObjectProperties(o1, ['sa1', 'do1.da1'])
    expect(o1).toStrictEqual({
      ...omitObjectProperties(o1, ['sa1']),
      do1: { ...omitObjectProperties(o1.do1, ['da1']) }
    })

    deleteObjectProperties(o1, (_, __, value: unknown) => typeof value === 'number', { deep: true })
    expect(o1).toStrictEqual({
      ...omitObjectProperties(o1, ['snm1']),
      do1: { ...omitObjectProperties(o1.do1, ['dnm1']) }
    })
  })

  it('deletes object properties shallowly', () => {
    deleteObjectProperties(o1, ['sa1', 'do1.da1'])
    expect(o1).toStrictEqual({
      ...omitObjectProperties(o1, ['sa1']),
      do1: { ...o1.do1 }
    })

    deleteObjectProperties(o1, (_, __, value: unknown) => typeof value === 'number')
    expect(o1).toStrictEqual({
      ...omitObjectProperties(o1, ['snm1']),
      do1: { ...o1.do1 }
    })
  })

  it('flattens an object', () => {
    expect(flattenObject(o1)).toStrictEqual({
      'do1.da1': [0],
      'do1.dnm1': 0,
      'do1.ds1': '',
      'do1.du1': undefined,
      ...omitObjectProperties(o1, ['do1'])
    })
    expect(flattenObject(o1, { array: true })).toStrictEqual({
      'do1.da1.0': 0,
      'do1.dnm1': 0,
      'do1.ds1': '',
      'do1.du1': undefined,
      'sa1.0': 0,
      ...omitObjectProperties(o1, ['sa1', 'do1'])
    })
  })

  it('gets an object property', () => {
    expect(getObjectProperty(o1, 'snm1')).toBe(0)
    expect(getObjectProperty(o1, 'do1.dnm1')).toBe(0)
    expect(getObjectProperty(o1, 'do1.da1.0')).toBe(0)
    expect(getObjectProperty(o1, 'do1.da1.[0]')).toBe(0)
    expect(getObjectProperty(o1, 'do1.da1[0]')).toBe(0)
    expect(getObjectProperty(o1, 'unknown')).toBeUndefined()
    expect(getObjectProperty(o1, 'unknown', null)).toBeNull()
    expect(getObjectProperty(o1, 'unknown.unknown')).toBeUndefined()
    expect(getObjectProperty(o1, 'snl1.unknown')).toBeUndefined()
    expect(getObjectProperty(o1.do1.da1, 0)).toBe(0)
  })

  it('merges multiple objects', () => {
    let co1: Object, co2: Object

    o2.do1.da1 = [1, 2]
    o2.do1.dnm1 = 1
    o2.sbi1 = 1n
    o2.sbo1 = true

    co1 = cloneObject(o1, { deep: true })
    co2 = cloneObject(o2, { deep: true })

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
        ...o1.do1,
        da1: [0, 2]
      }
    })

    expect(o1).toStrictEqual(co1)
    expect(o2).toStrictEqual(co2)
  })

  it('omits an object properties', () => {
    expect(omitObjectProperties(o1, ['do1'])).toStrictEqual({
      sa1: o1.sa1,
      sbi1: o1.sbi1,
      sbo1: o1.sbo1,
      sf1: o1.sf1,
      snl1: null,
      snm1: o1.snm1,
      ss1: '',
      sy1: o1.sy1,
      su1: undefined
    })
    expect(omitObjectProperties(o1, ['snm1'])).toStrictEqual({
      do1: o1.do1,
      sa1: o1.sa1,
      sbi1: o1.sbi1,
      sbo1: o1.sbo1,
      sf1: o1.sf1,
      snl1: null,
      ss1: '',
      sy1: o1.sy1,
      su1: undefined
    })
  })

  it('picks an object properties', () => {
    expect(pickObjectProperties(o1, ['do1'])).toStrictEqual({ do1: o1.do1 })
    expect(pickObjectProperties(o1, ['snm1'])).toStrictEqual({ snm1: 0 })
  })

  it('sets an object property', () => {
    setObjectProperty(o1, 'snm1', 1)
    expect(o1.snm1).toBe(1)

    setObjectProperty(o1, 'do1.dnm1', 1)
    expect(o1.do1.dnm1).toBe(1)

    setObjectProperty(o1, 'do1.da1.0', 1)
    expect(o1.do1.da1[0]).toBe(1)

    setObjectProperty(o1.do1.da1, 0, 0)
    expect(o1.do1.da1[0]).toBe(0)

    setObjectProperty(o1, 'do2.da1.[0]', 0)
    // @ts-ignore
    expect(o1.do2.da1[0]).toBe(0)

    expect(setObjectProperty(o1, 'snm1.0', 0)).toBeInstanceOf(Error)
  })

  it('checks if object has property', () => {
    expect(hasObjectProperty(o1, 'snm1')).toBeTruthy()
    expect(hasObjectProperty(o1, 'do1.dnm1')).toBeTruthy()
    expect(hasObjectProperty(o1, 'do1.da1.0')).toBeTruthy()
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
