import { DocumentCookie } from '../../src'

describe('DocumentCookie', () => {
  beforeEach(() => {
    DocumentCookie.clear()
  })

  it('sets and gets', async () => {
    await DocumentCookie.set('person', { name: 'john' })
    expect(await DocumentCookie.get('person')).toStrictEqual({ name: 'john' })
  })

  it('does not throw if window is undefined', async () => {
    // @ts-ignore
    delete global.window

    expect(await DocumentCookie.set('person', { name: 'john' })).toBeUndefined()
    expect(await DocumentCookie.get('person')).toStrictEqual({})
  })
})
