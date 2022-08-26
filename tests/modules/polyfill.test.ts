import { getObjectProperty, Polyfill, setObjectProperty } from '../../src'

describe('Polyfill', () => {
  it('polyfills fetch', async () => {
    // @ts-ignore
    delete global.Blob
    // @ts-ignore
    delete global.fetch
    // @ts-ignore
    delete global.File
    // @ts-ignore
    delete global.FormData

    global.window = {} as any
    delete process.env.JEST_WORKER_ID

    await Polyfill.blob()
    await Polyfill.fetch()
    await Polyfill.file()
    await Polyfill.formData()

    expect(global.Blob).toBeUndefined()
    expect(global.fetch).toBeUndefined()
    expect(global.File).toBeUndefined()
    expect(global.FormData).toBeUndefined()

    process.env.JEST_WORKER_ID = ''

    await Polyfill.blob()
    await Polyfill.fetch()
    await Polyfill.file()
    await Polyfill.formData()

    expect(Blob).toBeDefined()
    expect(fetch).toBeDefined()
    expect(File).toBeDefined()
    expect(FormData).toBeDefined()

    await Polyfill.blob()
    await Polyfill.fetch()
    await Polyfill.file()
    await Polyfill.formData()
  })

  it('does not polyfill fetch if unable to import node-fetch', async () => {
    let getNodeFetch: Function | undefined

    getNodeFetch = getObjectProperty(Polyfill, 'getNodeFetch')
    setObjectProperty(Polyfill, 'getNodeFetch', () => new Error())

    // @ts-ignore
    delete global.Blob
    // @ts-ignore
    delete global.fetch
    // @ts-ignore
    delete global.File
    // @ts-ignore
    delete global.FormData

    await Polyfill.blob()
    await Polyfill.fetch()
    await Polyfill.file()
    await Polyfill.formData()

    expect(global.Blob).toBeUndefined()
    expect(global.fetch).toBeUndefined()
    expect(global.File).toBeUndefined()
    expect(global.FormData).toBeUndefined()

    setObjectProperty(Polyfill, 'getNodeFetch', getNodeFetch)
  })
})
