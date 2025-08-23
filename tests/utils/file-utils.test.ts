import { beforeEach, describe, expect, it } from 'vitest'
import { AracnaFile, deserializeFile, serializeFile } from '../../src'

describe('File Utils', () => {
  let file: File, afile: AracnaFile

  beforeEach(() => {
    file = new File(['hello'], 'file', { lastModified: Date.now(), type: 'text/plain' })
    afile = new AracnaFile(file)
  })

  it('deserializes a file', async () => {
    afile = await deserializeFile(file, { resolveArrayBuffer: true, resolveText: true })

    expect(afile.arrayBuffer).toStrictEqual(await file.arrayBuffer())
    expect(afile.uInt8Array).toStrictEqual(await file.bytes())

    expect(afile.file).toBe(file)
    expect(afile.id).toHaveLength(32)
    expect(afile.lastModified).toBe(file.lastModified)
    expect(afile.lastModifiedDate).toStrictEqual(new Date(file.lastModified))
    expect(afile.name).toBe(file.name)
    expect(afile.size).toBe(file.size)
    expect(afile.text).toBe('hello')
    expect(afile.type).toBe(file.type)
    expect(afile.webkitRelativePath).toBe(file.webkitRelativePath)
  })

  it('serializes a file', async () => {
    await afile.resolveArrayBuffer()
    await afile.resolveText()

    file = serializeFile(afile)

    expect(await file.arrayBuffer()).toStrictEqual(afile.arrayBuffer)
    expect(await file.bytes()).toStrictEqual(afile.uInt8Array)
    expect(await file.text()).toBe(afile.text)

    expect(file.lastModified).toBe(afile.lastModified)
    expect(file.name).toBe(afile.name)
    expect(file.size).toBe(afile.size)
    expect(file.type).toBe(afile.type)
    expect(file.webkitRelativePath).toBe(afile.webkitRelativePath)
  })
})
