import { beforeAll, describe, expect, it } from 'vitest'
import { AracnaFile } from '../../src'
import { AracnaFileJSON } from '../../src/definitions/interfaces'

describe('AracnaFile', () => {
  let file: File, afile: AracnaFile

  beforeAll(async () => {
    file = new File(['hello'], 'file', { lastModified: Date.now(), type: 'text/plain' })
    afile = new AracnaFile(file)
  })

  it('constructs from file', () => {
    expect(afile.arrayBuffer).toStrictEqual(new ArrayBuffer(0))
    expect(afile.file).toBe(file)
    expect(afile.id).toHaveLength(32)
    expect(afile.size).toBe(5)
    expect(afile.text).toBe('')
    expect(afile.type).toBe('text/plain')
    expect(afile.uInt8Array).toStrictEqual(new Uint8Array())
  })

  it('constructs from json', async () => {
    let json: AracnaFileJSON, afile2: AracnaFile

    await afile.resolveArrayBuffer()
    await afile.resolveText()

    json = JSON.parse(JSON.stringify(afile))

    expect(json.id).toBe(afile.id)
    expect(json.lastModified).toBe(afile.lastModified)
    expect(json.name).toBe(afile.name)
    expect(json.size).toBe(afile.size)
    expect(json.type).toBe(afile.type)
    expect(json.uInt8Array).toStrictEqual({ ...afile.uInt8Array })
    expect(json.webkitRelativePath).toBeUndefined()

    afile2 = new AracnaFile(json)

    expect(afile2.arrayBuffer).toStrictEqual(afile.arrayBuffer)
    // expect(afile2.file).toStrictEqual(file)
    expect(afile2.id).toBe(afile.id)
    // expect(afile2.lastModified).toBe(afile.lastModified)
    expect(afile2.name).toBe(afile.name)
    expect(afile2.size).toBe(afile.size)
    expect(afile2.text).toBe(afile.text)
    expect(afile2.type).toBe(afile.type)
    expect(afile2.uInt8Array).toStrictEqual(afile.uInt8Array)
    expect(json.webkitRelativePath).toBeUndefined()
  })
})
