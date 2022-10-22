import { beforeAll, describe, expect, it } from 'vitest'
import { Polyfill, QueelagFile } from '../../src'
import { QueelagFileJSON } from '../../src/definitions/interfaces'

describe('QueelagFile', () => {
  let file: File, qfile: QueelagFile

  beforeAll(async () => {
    await Polyfill.file()

    file = new File(['hello'], 'file', { lastModified: Date.now(), type: 'text/plain' })
    qfile = new QueelagFile(file)
  })

  it('constructs from file', () => {
    expect(qfile.arrayBuffer).toStrictEqual(new ArrayBuffer(0))
    expect(qfile.base64).toBe('')
    expect(qfile.file).toBe(file)
    expect(qfile.id).toHaveLength(32)
    expect(qfile.size).toBe(5)
    expect(qfile.text).toBe('')
    expect(qfile.type).toBe('text/plain')
    expect(qfile.uInt8Array).toStrictEqual(new Uint8Array())
  })

  it('constructs from json', async () => {
    let json: QueelagFileJSON, qfile2: QueelagFile

    await qfile.resolveArrayBuffer()
    await qfile.resolveText()

    json = JSON.parse(JSON.stringify(qfile))

    expect(json.id).toBe(qfile.id)
    expect(json.lastModified).toBe(qfile.lastModified)
    expect(json.name).toBe(qfile.name)
    expect(json.size).toBe(qfile.size)
    expect(json.text).toBe(qfile.text)
    expect(json.type).toBe(qfile.type)
    expect(json.uInt8Array).toStrictEqual({ ...qfile.uInt8Array })
    expect(json.webkitRelativePath).toBeUndefined()

    qfile2 = new QueelagFile(json)

    expect(qfile2.arrayBuffer).toStrictEqual(qfile.arrayBuffer)
    expect(qfile2.base64).toBe(qfile.base64)
    expect(qfile2.file).toStrictEqual(file)
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
