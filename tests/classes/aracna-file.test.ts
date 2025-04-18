import { beforeAll, describe, expect, it } from 'vitest'
import { AracnaFile, importNodeFetch, useNodeFetch } from '../../src'
import { AracnaFileJSON } from '../../src/definitions/interfaces'

describe('AracnaFile', () => {
  let file: File, qfile: AracnaFile

  beforeAll(async () => {
    await useNodeFetch(await importNodeFetch())

    file = new File(['hello'], 'file', { lastModified: Date.now(), type: 'text/plain' })
    qfile = new AracnaFile(file)
  })

  it('constructs from file', () => {
    expect(qfile.arrayBuffer).toStrictEqual(new ArrayBuffer(0))
    expect(qfile.file).toBe(file)
    expect(qfile.id).toHaveLength(32)
    expect(qfile.size).toBe(5)
    expect(qfile.text).toBe('')
    expect(qfile.type).toBe('text/plain')
    expect(qfile.uInt8Array).toStrictEqual(new Uint8Array())
  })

  it('constructs from json', async () => {
    let json: AracnaFileJSON, qfile2: AracnaFile

    await qfile.resolveArrayBuffer()
    await qfile.resolveText()

    json = JSON.parse(JSON.stringify(qfile))

    expect(json.id).toBe(qfile.id)
    expect(json.lastModified).toBe(qfile.lastModified)
    expect(json.name).toBe(qfile.name)
    expect(json.size).toBe(qfile.size)
    expect(json.type).toBe(qfile.type)
    expect(json.uInt8Array).toStrictEqual({ ...qfile.uInt8Array })
    expect(json.webkitRelativePath).toBeUndefined()

    qfile2 = new AracnaFile(json)

    expect(qfile2.arrayBuffer).toStrictEqual(qfile.arrayBuffer)
    // expect(qfile2.file).toStrictEqual(file)
    expect(qfile2.id).toBe(qfile.id)
    // expect(qfile2.lastModified).toBe(qfile.lastModified)
    expect(qfile2.name).toBe(qfile.name)
    expect(qfile2.size).toBe(qfile.size)
    expect(qfile2.text).toBe(qfile.text)
    expect(qfile2.type).toBe(qfile.type)
    expect(qfile2.uInt8Array).toStrictEqual(qfile.uInt8Array)
    expect(json.webkitRelativePath).toBeUndefined()
  })
})
