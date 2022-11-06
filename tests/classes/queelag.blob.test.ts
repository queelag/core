import { beforeAll, describe, expect, it } from 'vitest'
import { Base64, Polyfill, QueelagBlob, TextCodec } from '../../src'
import { QueelagBlobJSON } from '../../src/definitions/interfaces'

describe('QueelagBlob', () => {
  let blob: Blob, qblob: QueelagBlob

  beforeAll(async () => {
    await Polyfill.blob()

    blob = new Blob(['hello'], { type: 'text/plain' })
    qblob = new QueelagBlob(blob)
  })

  it('constructs from blob', () => {
    expect(qblob.arrayBuffer).toStrictEqual(new ArrayBuffer(0))
    expect(qblob.base64).toBe('')
    expect(qblob.blob).toBe(blob)
    expect(qblob.id).toHaveLength(32)
    expect(qblob.size).toBe(5)
    expect(qblob.text).toBe('')
    expect(qblob.type).toBe('text/plain')
    expect(qblob.uInt8Array).toStrictEqual(new Uint8Array())
  })

  it('constructs from json', async () => {
    let json: QueelagBlobJSON, qblob2: QueelagBlob

    await qblob.resolveArrayBuffer()
    await qblob.resolveText()

    json = JSON.parse(JSON.stringify(qblob))

    expect(json.id).toBe(qblob.id)
    expect(json.size).toBe(qblob.size)
    expect(json.text).toBe(qblob.text)
    expect(json.type).toBe(qblob.type)
    expect(json.uInt8Array).toStrictEqual({ ...qblob.uInt8Array })

    qblob2 = new QueelagBlob(json)

    expect(qblob2.arrayBuffer).toStrictEqual(qblob.arrayBuffer)
    expect(qblob2.base64).toBe(qblob.base64)
    expect(qblob2.blob).toStrictEqual(blob)
    expect(qblob2.id).toBe(qblob.id)
    expect(qblob2.size).toBe(qblob.size)
    expect(qblob2.text).toBe(qblob.text)
    expect(qblob2.type).toBe(qblob.type)
    expect(qblob2.uInt8Array).toStrictEqual(qblob.uInt8Array)
  })

  it('resolves array buffer', async () => {
    await qblob.resolveArrayBuffer()

    expect(qblob.arrayBuffer).toStrictEqual(TextCodec.encode('hello').buffer)
    expect(qblob.base64).toBe(Base64.encode(TextCodec.encode('hello')))
    expect(qblob.uInt8Array).toStrictEqual(TextCodec.encode('hello'))
  })

  it('resolves text', async () => {
    await qblob.resolveArrayBuffer()

    expect(qblob.base64).toBe(Base64.encode(TextCodec.encode('hello')))
    expect(qblob.text).toBe('hello')
    expect(qblob.uInt8Array).toStrictEqual(TextCodec.encode('hello'))
  })
})
