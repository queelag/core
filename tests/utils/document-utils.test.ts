import { describe, expect, it } from 'vitest'
import { createDocumentElement, noop } from '../../src'

describe('DocumentUtils', () => {
  it('creates an element safely', () => {
    global.document = { createElement: noop } as any
    expect(createDocumentElement('div')).toBeUndefined()

    // @ts-ignore
    delete global.document
    expect(createDocumentElement('div')).toStrictEqual({})
  })
})
