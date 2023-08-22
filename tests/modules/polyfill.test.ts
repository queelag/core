import { describe, expect, it } from 'vitest'
import { useNodeFetch } from '../../src'

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
    process.env.NODE_ENV = 'development'
    // delete process.env.JEST_WORKER_ID

    await useNodeFetch(await import('node-fetch'))

    expect(global.Blob).toBeUndefined()
    expect(global.fetch).toBeUndefined()
    expect(global.File).toBeUndefined()
    expect(global.FormData).toBeUndefined()

    process.env.NODE_ENV = 'test'
    // process.env.JEST_WORKER_ID = ''

    await useNodeFetch(await import('node-fetch'))

    expect(Blob).toBeDefined()
    expect(fetch).toBeDefined()
    expect(File).toBeDefined()
    expect(FormData).toBeDefined()

    await useNodeFetch(await import('node-fetch'))
  })

  it('does not polyfill fetch if unable to import node-fetch', async () => {
    // @ts-ignore
    delete global.Blob
    // @ts-ignore
    delete global.fetch
    // @ts-ignore
    delete global.File
    // @ts-ignore
    delete global.FormData

    await useNodeFetch(new Error())

    expect(global.Blob).toBeUndefined()
    expect(global.fetch).toBeUndefined()
    expect(global.File).toBeUndefined()
    expect(global.FormData).toBeUndefined()
  })
})
