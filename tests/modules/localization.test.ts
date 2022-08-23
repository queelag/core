import { Localization, LocalizationPack } from '../../src'

const EN: LocalizationPack = { data: { hello: 'hello @name' }, language: 'en' }
const IT: LocalizationPack = { data: { hello: 'ciao @name' }, language: 'it' }

describe('Localization', () => {
  let localization: Localization

  beforeEach(() => {
    localization = new Localization('en')
  })

  it('adds packs', () => {
    localization.push(EN, IT)
    expect(localization.packs).toStrictEqual([EN, IT])
  })

  it('gets localized text', () => {
    localization.push(EN, IT)
    expect(localization.get('hello')).toBe('hello @name')
    expect(localization.get('it', 'hello')).toBe('ciao @name')

    localization.language = 'it'
    expect(localization.get('hello')).toBe('ciao @name')
    expect(localization.get('en', 'hello')).toBe('hello @name')

    localization.language = 'en'
    expect(localization.get('hello', { name: 'john' })).toBe('hello john')
    expect(localization.get('it', 'hello', { name: 'john' })).toBe('ciao john')
  })

  it('checks if path exists inside at least one of the packs', () => {
    localization.push(EN, IT)
    expect(localization.has('hello')).toBeTruthy()
    expect(localization.has('unknown')).toBeFalsy()
  })

  it('sets language', () => {
    localization.setLanguage('it')
    expect(localization.language).toBe('it')
  })

  it('gets pack by language', () => {
    localization.push(EN, IT)
    expect(localization.getPackByLanguage('en')).toStrictEqual(EN)
    expect(localization.getPackByLanguage('it')).toStrictEqual(IT)
  })

  it('stores language', async () => {
    expect(await localization.storeLanguage('it')).toBeTruthy()
    localization.setLanguage('en')
    expect(await localization.initialize()).toBeTruthy()
    expect(localization.language).toBe('it')
  })
})
