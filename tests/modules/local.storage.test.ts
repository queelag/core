import { LocalStorage } from '../../src'

describe('LocalStorage', () => {
  beforeEach(async () => {
    await LocalStorage.clear()
  })

  it('clears', async () => {
    await LocalStorage.set('person', {})
    expect(await LocalStorage.has('person')).toBeTruthy()
    await LocalStorage.clear()
    expect(await LocalStorage.has('person')).toBeFalsy()
  })

  it('gets', async () => {
    expect(await LocalStorage.get('person')).toStrictEqual({})
    await LocalStorage.set('person', { name: 'john' })
    expect(await LocalStorage.get('person')).toStrictEqual({ name: 'john' })
  })

  it('has', async () => {
    await LocalStorage.set('person', {})
    expect(await LocalStorage.has('person')).toBeTruthy()
  })

  it('removes', async () => {
    await LocalStorage.set('person', {})
    expect(await LocalStorage.has('person')).toBeTruthy()
    await LocalStorage.remove('person')
    expect(await LocalStorage.has('person')).toBeFalsy()
  })

  it('sets', async () => {
    await LocalStorage.set('person', {})
    expect(await LocalStorage.has('person')).toBeTruthy()
  })

  it('does not throw if window is undefined', async () => {
    // @ts-ignore
    delete global.window

    expect(await LocalStorage.clear()).toBeUndefined()
    expect(await LocalStorage.get('person')).toStrictEqual({})
    expect(await LocalStorage.has('person')).toBeFalsy()
    expect(await LocalStorage.remove('person')).toBeUndefined()
    expect(await LocalStorage.set('person', {})).toBeUndefined()
  })
})
