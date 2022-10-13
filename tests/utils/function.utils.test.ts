import { describe, expect, it } from 'vitest'
import { isInstanceOf } from '../../src'

describe('FunctionUtils', () => {
  it('checks instance of variable', () => {
    expect(isInstanceOf(new Error(), Error)).toBeTruthy()
    expect(isInstanceOf(0, Error)).toBeFalsy()
  })
})
