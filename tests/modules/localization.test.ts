import { Localization, LocalizationPack } from '../../src'

const EN: LocalizationPack = { data: { hello: 'hello {name}', bye: 'bye' }, language: 'en' }
const IT: LocalizationPack = { data: { hello: 'ciao {name}', bye: 'ciao' }, language: 'it' }

describe('Localization', () => {
  let localization: Localization

  beforeEach(() => {
    localization = new Localization('en')
  })

  it('adds packs', () => {
    localization.push(EN, IT)
    expect(localization.packs).toStrictEqual([EN, IT])
  })

  it('merges already defined packs', () => {
    localization.push({ data: { hello: 'hello' }, language: 'en' })
    expect(localization.getPackByLanguage('en').data.hello).toBe('hello')

    localization.push({ data: { bye: 'bye' }, language: 'en' })
    expect(localization.getPackByLanguage('en').data.hello).toBe('hello')
    expect(localization.getPackByLanguage('en').data.bye).toBe('bye')
  })

  it('gets localized text', () => {
    localization.push(EN, IT)
    expect(localization.get('hello')).toBe('hello {name}')
    expect(localization.get('it', 'hello')).toBe('ciao {name}')

    localization.language = 'it'
    expect(localization.get('hello')).toBe('ciao {name}')
    expect(localization.get('en', 'hello')).toBe('hello {name}')

    localization.language = 'en'
    expect(localization.get('hello', { name: 'john' })).toBe('hello john')
    expect(localization.get('it', 'hello', { name: 'john' })).toBe('ciao john')

    expect(localization.get('bye')).toBe('bye')
    expect(localization.get('it', 'bye')).toBe('ciao')
  })

  it('falls back to the path if the property is not defined', () => {
    localization.push(EN)
    expect(localization.get('unknown')).toBe('unknown')
  })

  it('fails to localize text in an unknown language', () => {
    localization.push(EN)
    expect(localization.get('it', 'hello')).toBe('hello')
  })

  it('fails to inject variables if they are not defined', () => {
    localization.push(EN)
    expect(localization.get('hello')).toBe('hello {name}')
  })

  it('uses other pack data properties as variables', () => {
    localization.push({
      data: {
        first: 'first',
        question: 'are you {first}?'
      },
      language: 'en'
    })
    expect(localization.get('question')).toBe('are you first?')
  })

  it('uses global variables', () => {
    localization.push(EN)
    localization.setVariables({ name: 'john' })
    expect(localization.get('hello')).toBe('hello john')
  })

  it('checks if path exists inside at least one of the packs', () => {
    localization.push(EN)
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
