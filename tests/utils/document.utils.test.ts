import { createDocumentElement, noop } from '../../src'

describe('DocumentUtils', () => {
  it('creates an element safely', () => {
    global.document = { createElement: noop } as any
    expect(createDocumentElement('div')).toBeUndefined()

    // @ts-ignore
    delete global.window
    expect(createDocumentElement('div')).toStrictEqual({})
  })
})
