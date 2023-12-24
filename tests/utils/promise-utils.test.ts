import { describe, expect, it } from 'vitest'
import { isPromise, isPromiseLike, noop } from '../../src'

describe('Promise Utils', () => {
  it('checks if an unknown value is a promise', () => {
    expect(isPromise(0)).toBeFalsy()
    expect(isPromise(Promise.resolve())).toBeTruthy()
  })

  it('checks if an unknown value is promise like', () => {
    expect(isPromiseLike(0)).toBeFalsy()
    expect(isPromiseLike(Promise.resolve())).toBeTruthy()
    expect(isPromiseLike({ then: noop })).toBeTruthy()
  })
})
