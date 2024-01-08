import { describe, expect, it } from 'vitest'
import { joinPaths, joinWindowsPaths } from '../../src'

describe('Path Utils', () => {
  it('joins paths', () => {
    expect(joinPaths('/', 'folder', '1')).toBe('/folder/1')
    expect(joinPaths('/', '/folder', '1')).toBe('/folder/1')
    expect(joinPaths('/', '/folder', '/1')).toBe('/folder/1')
    expect(joinPaths('/', '/folder', '/1/')).toBe('/folder/1/')
    expect(joinPaths('/', 'folder/', '1')).toBe('/folder/1')
    expect(joinPaths('/', 'folder/', '/1')).toBe('/folder/1')
    expect(joinPaths('/', 'folder/', '1/')).toBe('/folder/1/')
    expect(joinPaths('/', 'folder/', '/1/')).toBe('/folder/1/')
    expect(joinPaths('/', '/folder/', '1')).toBe('/folder/1')
    expect(joinPaths('/', '/folder/', '/1')).toBe('/folder/1')
    expect(joinPaths('/', '/folder/', '1/')).toBe('/folder/1/')
    expect(joinPaths('/', '/folder/', '/1/')).toBe('/folder/1/')
  })

  it('joins windows paths', () => {
    expect(joinWindowsPaths('C:/', 'folder', '1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:/', '/folder', '1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:/', '/folder', '/1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:/', '/folder', '/1/')).toBe('C:\\folder\\1\\')
    expect(joinWindowsPaths('C:/', 'folder/', '1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:/', 'folder/', '/1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:/', 'folder/', '1/')).toBe('C:\\folder\\1\\')
    expect(joinWindowsPaths('C:/', 'folder/', '/1/')).toBe('C:\\folder\\1\\')
    expect(joinWindowsPaths('C:/', '/folder/', '1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:/', '/folder/', '/1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:/', '/folder/', '1/')).toBe('C:\\folder\\1\\')
    expect(joinWindowsPaths('C:/', '/folder/', '/1/')).toBe('C:\\folder\\1\\')

    expect(joinWindowsPaths('C:\\', 'folder', '1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:\\', '\\folder', '1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:\\', '\\folder', '\\1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:\\', '\\folder', '\\1\\')).toBe('C:\\folder\\1\\')
    expect(joinWindowsPaths('C:\\', 'folder\\', '1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:\\', 'folder\\', '\\1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:\\', 'folder\\', '1\\')).toBe('C:\\folder\\1\\')
    expect(joinWindowsPaths('C:\\', 'folder\\', '\\1\\')).toBe('C:\\folder\\1\\')
    expect(joinWindowsPaths('C:\\', '\\folder\\', '1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:\\', '\\folder\\', '\\1')).toBe('C:\\folder\\1')
    expect(joinWindowsPaths('C:\\', '\\folder\\', '1\\')).toBe('C:\\folder\\1\\')
    expect(joinWindowsPaths('C:\\', '\\folder\\', '\\1\\')).toBe('C:\\folder\\1\\')
  })
})
