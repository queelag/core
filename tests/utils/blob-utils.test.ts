import { beforeEach, describe, expect, it } from 'vitest'
import { AracnaBlob, deserializeBlob, serializeBlob } from '../../src'

describe('Blob Utils', () => {
  let blob: Blob, ablob: AracnaBlob

  beforeEach(() => {
    blob = new Blob(['hello'], { type: 'text/plain' })
    ablob = new AracnaBlob(blob)
  })

  it('deserializes a blob', async () => {
    ablob = await deserializeBlob(blob, { resolveArrayBuffer: true, resolveText: true })

    expect(ablob.arrayBuffer).toStrictEqual(await blob.arrayBuffer())
    expect(ablob.uInt8Array).toStrictEqual(await blob.bytes())

    expect(ablob.blob).toBe(blob)
    expect(ablob.id).toHaveLength(32)
    expect(ablob.size).toBe(blob.size)
    expect(ablob.text).toBe('hello')
    expect(ablob.type).toBe(blob.type)
  })

  it('serializes a blob', async () => {
    await ablob.resolveArrayBuffer()
    await ablob.resolveText()

    blob = serializeBlob(ablob)

    expect(await blob.arrayBuffer()).toStrictEqual(ablob.arrayBuffer)
    expect(await blob.bytes()).toStrictEqual(ablob.uInt8Array)
    expect(await blob.text()).toBe(ablob.text)

    expect(blob.size).toBe(ablob.size)
    expect(blob.type).toBe(ablob.type)
  })
})
