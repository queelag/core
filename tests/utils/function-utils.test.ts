import { describe, expect, it } from 'vitest'
import { isInstanceOf, isNotInstanceOf } from '../../src'

describe('Function Utils', () => {
  it('checks instance of variable', () => {
    expect(isInstanceOf(new Error(), Error)).toBeTruthy()
    expect(isInstanceOf(0, Error)).toBeFalsy()
    expect(isNotInstanceOf(new Error(), Error)).toBeFalsy()
    expect(isNotInstanceOf(0, Error)).toBeTruthy()
  })
})
