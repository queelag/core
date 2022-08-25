import { SessionStorage } from '../../src'

describe('SessionStorage', () => {
  beforeEach(async () => {
    await SessionStorage.clear()
  })

  it('clears', async () => {
    await SessionStorage.set('person', {})
    expect(await SessionStorage.has('person')).toBeTruthy()
    await SessionStorage.clear()
    expect(await SessionStorage.has('person')).toBeFalsy()
  })

  it('gets', async () => {
    expect(await SessionStorage.get('person')).toStrictEqual({})
    await SessionStorage.set('person', { name: 'john' })
    expect(await SessionStorage.get('person')).toStrictEqual({ name: 'john' })
  })

  it('has', async () => {
    await SessionStorage.set('person', {})
    expect(await SessionStorage.has('person')).toBeTruthy()
  })

  it('removes', async () => {
    await SessionStorage.set('person', {})
    expect(await SessionStorage.has('person')).toBeTruthy()
    await SessionStorage.remove('person')
    expect(await SessionStorage.has('person')).toBeFalsy()
  })

  it('sets', async () => {
    await SessionStorage.set('person', {})
    expect(await SessionStorage.has('person')).toBeTruthy()
  })

  it('does not throw if window is undefined', async () => {
    // @ts-ignore
    delete global.window

    expect(await SessionStorage.clear()).toBeUndefined()
    expect(await SessionStorage.get('person')).toStrictEqual({})
    expect(await SessionStorage.has('person')).toBeFalsy()
    expect(await SessionStorage.remove('person')).toBeUndefined()
    expect(await SessionStorage.set('person', {})).toBeUndefined()
  })
})
