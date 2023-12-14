import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { Appearence } from '../../src'

describe('Appearence', () => {
  let onChangeTheme: Mock, appearence: Appearence

  beforeEach(() => {
    onChangeTheme = vi.fn()

    appearence = new Appearence()
    appearence.on('change-theme', onChangeTheme)
  })

  it('starts with system theme', () => {
    expect(appearence.theme).toBe('system')
  })

  it('initializes', async () => {
    expect(await appearence.initialize()).toBeTruthy()
    expect(appearence.theme).toBe('system')
    appearence.setTheme('dark')
    expect(appearence.theme).toBe('dark')
    expect(await appearence.store()).toBeTruthy()
    expect(await appearence.initialize()).toBeTruthy()
    expect(appearence.theme).toBe('dark')
  })

  it('sets the theme', () => {
    appearence.setTheme('dark')
    expect(appearence.theme).toBe('dark')
    expect(onChangeTheme).toBeCalledTimes(1)
    appearence.setTheme('light')
    expect(appearence.theme).toBe('light')
    expect(onChangeTheme).toBeCalledTimes(2)
    appearence.setTheme('system')
    expect(appearence.theme).toBe('system')
    expect(onChangeTheme).toBeCalledTimes(3)
  })

  it('toggles the theme', () => {
    appearence.toggleTheme()
    expect(appearence.theme).toBe('dark')
    appearence.toggleTheme()
    expect(appearence.theme).toBe('light')
    appearence.toggleTheme()
    expect(appearence.theme).toBe('dark')
  })

  it('stores', async () => {
    appearence.setTheme('dark')
    expect(appearence.theme).toBe('dark')
    expect(await appearence.store()).toBeTruthy()
    expect(await appearence.initialize()).toBeTruthy()
    expect(appearence.theme).toBe('dark')
  })
})
