import { Mock, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { TypeaheadMapKey, sleep, typeahead } from '../../src'
import { DEFAULT_TYPEAHEAD_DEBOUNCE_TIME, TYPEAHEAD_MAP } from '../../src/definitions/constants'

describe('typeahead', () => {
  let key: TypeaheadMapKey, items: string[]

  beforeAll(() => {
    key = Symbol('typeahead')
    items = ['apple', 'banana', 'cherry']
  })

  afterEach(() => {
    TYPEAHEAD_MAP.clear()
  })

  it('captures the key and adds it to the query', async () => {
    expect(typeahead(key, 'a').getQuery()).toBe('a')
    expect(typeahead(key, 'b').getQuery()).toBe('ab')

    await sleep(DEFAULT_TYPEAHEAD_DEBOUNCE_TIME)

    expect(typeahead(key, 'c').getQuery()).toBe('c')
  })

  it('emits the match event when a match is found', async () => {
    let onMatch: Mock = vi.fn()

    typeahead(key, 'a', { items, listeners: [{ callback: onMatch, name: 'match' }], predicate: (item: string, query: string) => item.startsWith(query) })

    await sleep(DEFAULT_TYPEAHEAD_DEBOUNCE_TIME)

    expect(onMatch).toHaveBeenCalledTimes(1)
    expect(onMatch).toHaveBeenCalledWith('apple')

    await sleep(DEFAULT_TYPEAHEAD_DEBOUNCE_TIME)

    onMatch.mockReset()

    typeahead(key, 'b')
    typeahead(key, 'a')

    await sleep(DEFAULT_TYPEAHEAD_DEBOUNCE_TIME)

    expect(onMatch).toHaveBeenCalledTimes(1)
    expect(onMatch).toHaveBeenCalledWith('banana')
  })

  it('supports a custom debounce time', async () => {
    expect(typeahead(key, 'a', { debounceTime: 200 }).getQuery()).toBe('a')
    expect(typeahead(key, 'b').getQuery()).toBe('ab')

    await sleep(200)

    expect(typeahead(key, 'c').getQuery()).toBe('c')
  })
})
