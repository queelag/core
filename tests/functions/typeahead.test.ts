import { Mock, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { sleep, typeahead } from '../../src'
import { DEFAULT_TYPEAHEAD_DEBOUNCE_TIME, TYPEAHEAD_MAP } from '../../src/definitions/constants'

describe('typeahead', () => {
  let name: string, items: string[]

  beforeAll(() => {
    name = 'combobox'
    items = ['apple', 'banana', 'cherry']
  })

  afterEach(() => {
    TYPEAHEAD_MAP.clear()
  })

  it('captures the key and adds it to the query', async () => {
    expect(typeahead(name, 'a').getQuery()).toBe('a')
    expect(typeahead(name, 'b').getQuery()).toBe('ab')

    await sleep(DEFAULT_TYPEAHEAD_DEBOUNCE_TIME)

    expect(typeahead(name, 'c').getQuery()).toBe('c')
  })

  it('emits the match event when a match is found', async () => {
    let onMatch: Mock = vi.fn()

    typeahead(name, 'a', { items, listeners: [{ callback: onMatch, name: 'match' }], predicate: (item: string, query: string) => item.startsWith(query) })

    expect(onMatch).toHaveBeenCalledTimes(1)
    expect(onMatch).toHaveBeenCalledWith('apple')

    await sleep(DEFAULT_TYPEAHEAD_DEBOUNCE_TIME)

    onMatch.mockReset()

    typeahead(name, 'b')
    typeahead(name, 'a')

    expect(onMatch).toHaveBeenCalledTimes(2)
    expect(onMatch).toHaveBeenCalledWith('banana')
  })

  it('supports a custom debounce time', async () => {
    expect(typeahead(name, 'a', { debounceTime: 200 }).getQuery()).toBe('a')
    expect(typeahead(name, 'b').getQuery()).toBe('ab')

    await sleep(200)

    expect(typeahead(name, 'c').getQuery()).toBe('c')
  })
})
