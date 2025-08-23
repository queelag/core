import { beforeAll, describe, expect, it } from 'vitest'
import { AracnaBlob } from '../../src'
import { AracnaBlobJSON } from '../../src/definitions/interfaces'
import { encodeText } from '../../src/utils/text-utils'

describe('AracnaBlob', () => {
  let blob: Blob, ablob: AracnaBlob

  beforeAll(async () => {
    blob = new Blob(['hello'], { type: 'text/plain' })
    ablob = new AracnaBlob(blob)
  })

  it('constructs from blob', () => {
    expect(ablob.arrayBuffer).toStrictEqual(new ArrayBuffer(0))
    expect(ablob.blob).toBe(blob)
    expect(ablob.id).toHaveLength(32)
    expect(ablob.size).toBe(5)
    expect(ablob.text).toBe('')
    expect(ablob.type).toBe('text/plain')
    expect(ablob.uInt8Array).toStrictEqual(new Uint8Array())
  })

  it('constructs from json', async () => {
    let json: AracnaBlobJSON, ablob2: AracnaBlob

    await ablob.resolveArrayBuffer()
    await ablob.resolveText()

    json = JSON.parse(JSON.stringify(ablob))

    expect(json.id).toBe(ablob.id)
    expect(json.size).toBe(ablob.size)
    expect(json.type).toBe(ablob.type)
    expect(json.uInt8Array).toStrictEqual({ ...ablob.uInt8Array })

    ablob2 = new AracnaBlob(json)

    expect(ablob2.arrayBuffer).toStrictEqual(ablob.arrayBuffer)
    expect(ablob2.blob).toStrictEqual(blob)
    expect(ablob2.id).toBe(ablob.id)
    expect(ablob2.size).toBe(ablob.size)
    expect(ablob2.text).toBe(ablob.text)
    expect(ablob2.type).toBe(ablob.type)
    expect(ablob2.uInt8Array).toStrictEqual(ablob.uInt8Array)
  })

  it('resolves array buffer', async () => {
    await ablob.resolveArrayBuffer()

    expect(ablob.arrayBuffer).toStrictEqual(encodeText('hello').buffer)
    expect(ablob.uInt8Array).toStrictEqual(encodeText('hello'))
  })

  it('resolves text', async () => {
    await ablob.resolveArrayBuffer()

    expect(ablob.text).toBe('hello')
    expect(ablob.uInt8Array).toStrictEqual(encodeText('hello'))
  })
})
