import { isError, isNotError } from '../../src'

describe('ErrorUtils', () => {
  it('checks if variable is instanceof error', () => {
    expect(isError(new Error())).toBeTruthy()
    expect(isError(0)).toBeFalsy()
    expect(isNotError(new Error())).toBeFalsy()
    expect(isNotError(0)).toBeTruthy()
  })
})
