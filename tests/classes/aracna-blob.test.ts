import { beforeAll, describe, expect, it } from 'vitest'
import { AracnaBlob, importNodeFetch, useNodeFetch } from '../../src'
import { AracnaBlobJSON } from '../../src/definitions/interfaces'
import { encodeText } from '../../src/utils/text-utils'

describe('AracnaBlob', () => {
  let blob: Blob, qblob: AracnaBlob

  beforeAll(async () => {
    await useNodeFetch(await importNodeFetch())

    blob = new Blob(['hello'], { type: 'text/plain' })
    qblob = new AracnaBlob(blob)
  })

  it('constructs from blob', () => {
    expect(qblob.arrayBuffer).toStrictEqual(new ArrayBuffer(0))
    expect(qblob.blob).toBe(blob)
    expect(qblob.id).toHaveLength(32)
    expect(qblob.size).toBe(5)
    expect(qblob.text).toBe('')
    expect(qblob.type).toBe('text/plain')
    expect(qblob.uInt8Array).toStrictEqual(new Uint8Array())
  })

  it('constructs from json', async () => {
    let json: AracnaBlobJSON, qblob2: AracnaBlob

    await qblob.resolveArrayBuffer()
    await qblob.resolveText()

    json = JSON.parse(JSON.stringify(qblob))

    expect(json.id).toBe(qblob.id)
    expect(json.size).toBe(qblob.size)
    expect(json.type).toBe(qblob.type)
    expect(json.uInt8Array).toStrictEqual({ ...qblob.uInt8Array })

    qblob2 = new AracnaBlob(json)

    expect(qblob2.arrayBuffer).toStrictEqual(qblob.arrayBuffer)
    expect(qblob2.blob).toStrictEqual(blob)
    expect(qblob2.id).toBe(qblob.id)
    expect(qblob2.size).toBe(qblob.size)
    expect(qblob2.text).toBe(qblob.text)
    expect(qblob2.type).toBe(qblob.type)
    expect(qblob2.uInt8Array).toStrictEqual(qblob.uInt8Array)
  })

  it('resolves array buffer', async () => {
    await qblob.resolveArrayBuffer()

    expect(qblob.arrayBuffer).toStrictEqual(encodeText('hello').buffer)
    expect(qblob.uInt8Array).toStrictEqual(encodeText('hello'))
  })

  it('resolves text', async () => {
    await qblob.resolveArrayBuffer()

    expect(qblob.text).toBe('hello')
    expect(qblob.uInt8Array).toStrictEqual(encodeText('hello'))
  })
})
