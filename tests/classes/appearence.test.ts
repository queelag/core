import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { Appearence, MemoryStorage } from '../../src'

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

    appearence = new Appearence()
  })

  it('sets the theme', () => {
    appearence.setTheme('dark')
    expect(appearence.theme).toBe('dark')
    expect(appearence.isThemeDark).toBeTruthy()
    expect(appearence.isThemeLight).toBeFalsy()
    expect(appearence.isThemeSystem).toBeFalsy()
    expect(onChangeTheme).toHaveBeenCalledTimes(1)

    appearence.setTheme('light')
    expect(appearence.theme).toBe('light')
    expect(appearence.isThemeDark).toBeFalsy()
    expect(appearence.isThemeLight).toBeTruthy()
    expect(appearence.isThemeSystem).toBeFalsy()
    expect(onChangeTheme).toHaveBeenCalledTimes(2)

    appearence.setTheme('system')
    expect(appearence.theme).toBe('system')
    expect(appearence.isThemeDark).toBeFalsy()
    expect(appearence.isThemeLight).toBeTruthy()
    expect(appearence.isThemeSystem).toBeTruthy()
    expect(onChangeTheme).toHaveBeenCalledTimes(3)
  })

  it('toggles the theme', () => {
    appearence.toggleTheme()
    expect(appearence.theme).toBe('dark')
    expect(appearence.isThemeDark).toBeTruthy()

    appearence.toggleTheme()
    expect(appearence.theme).toBe('light')
    expect(appearence.isThemeLight).toBeTruthy()

    appearence.toggleTheme()
    expect(appearence.theme).toBe('dark')
    expect(appearence.isThemeDark).toBeTruthy()
  })

  it('stores', async () => {
    appearence.setTheme('dark')
    expect(appearence.theme).toBe('dark')

    expect(await appearence.store()).toBeTruthy()
    expect(await appearence.initialize()).toBeTruthy()
    expect(appearence.theme).toBe('dark')
  })

  it('works with prefers-color-scheme', async () => {
    appearence = new Appearence()

    appearence.setTheme('system')
    expect(appearence.isThemeLight).toBeTruthy()

    globalThis.window = {
      // @ts-expect-error
      matchMedia: () => ({
        matches: false
      })
    }

    appearence = new Appearence()

    appearence.setTheme('system')
    expect(appearence.isThemeLight).toBeTruthy()

    globalThis.matchMedia = () => ({
      // @ts-expect-error
      addEventListener: (name: string, fn: Function) => fn(),
      matches: false
    })

    appearence = new Appearence()

    appearence.setTheme('system')
    expect(appearence.isThemeLight).toBeTruthy()

    globalThis.matchMedia = () => ({
      // @ts-expect-error
      addEventListener: (name: string, fn: Function) => fn(),
      matches: true
    })

    appearence = new Appearence()

    appearence.setTheme('system')
    expect(appearence.isThemeDark).toBeTruthy()

    appearence.toggleTheme()
    expect(appearence.theme).toBe('light')

    // @ts-expect-error
    delete globalThis.matchMedia
  })
})
