import { SORT_REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS_MATCHES_COMPARE_FN } from '../../src/definitions/constants'

describe('Constants', () => {
  test('sort regexp variable inside curly brackets matches compare fn', () => {
    expect(SORT_REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS_MATCHES_COMPARE_FN('a', 'abc')).toBe(2)
    expect(SORT_REGEXP_VARIABLE_INSIDE_CURLY_BRACKETS_MATCHES_COMPARE_FN('abc', 'a')).toBe(-2)
  })
})
