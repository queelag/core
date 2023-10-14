import { StorageName } from '../definitions/enums.js'
import { Theme } from '../definitions/types.js'
import { noop } from '../functions/noop.js'
import { ModuleLogger } from '../loggers/module-logger.js'
import { isNotError } from '../utils/error-utils.js'
import { AsyncStorage } from './async-storage.js'
import { Environment } from './environment.js'
import { SyncStorage } from './sync-storage.js'

export class Appearence {
  storage?: AsyncStorage | SyncStorage
  theme: Theme

  constructor(onChangeTheme: (theme: Theme) => any = noop, theme: Theme = 'system', storage?: AsyncStorage | SyncStorage) {
    this.storage = storage
    this.theme = theme

    this.onChangeTheme = onChangeTheme

    this.registerThemeEventListener()
  }

  onChangeTheme(theme: Theme): any {}

  async initialize(): Promise<boolean> {
    if (this.storage) {
      let copied: void | Error

      copied = await this.storage.copy(StorageName.APPEARENCE, this, ['theme'])
      if (copied instanceof Error) return false

      this.setTheme(this.theme)
    }

    return true
  }

  toggleTheme(): void {
    switch (this.theme) {
      case 'dark':
        return this.setTheme('light')
      case 'light':
        return this.setTheme('dark')
      case 'system':
        return this.setTheme(this.themeByPrefersColorScheme === 'dark' ? 'light' : 'dark')
      default:
        return
    }
  }

  setTheme(theme: Theme): void {
    this.theme = theme
    ModuleLogger.verbose('Appearance', 'setTheme', `The theme has been set to ${theme}.`)

    switch (theme) {
      case 'dark':
      case 'light':
        this.onChangeTheme(theme)
        break
      case 'system':
        this.onChangeTheme(this.themeByPrefersColorScheme)
        break
      default:
        this.onChangeTheme(theme)
        break
    }
  }

  async store(): Promise<boolean> {
    if (this.storage) {
      return isNotError(await this.storage.set(StorageName.APPEARENCE, this, ['theme']))
    }

    return false
  }

  private registerThemeEventListener(): void {
    let media: MediaQueryList

    if (Environment.isWindowNotDefined) {
      return ModuleLogger.warn('Appearance', 'registerThemeEventListener', `The window is not defined.`)
    }

    if (typeof window.matchMedia === 'undefined') {
      return ModuleLogger.warn('Appearance', 'registerThemeEventListener', `The window.matchMedia function is not defined.`)
    }

    media = window.matchMedia('(prefers-color-scheme: dark)')
    if (typeof media.addEventListener !== 'function')
      return ModuleLogger.warn('Appearance', 'registerThemeEventListener', `The window.matchMedia.addEventListener function is not defined.`)

    media.addEventListener('change', (v: MediaQueryListEvent) => this.isThemeSystem && this.setTheme('system'))
  }

  get themeByPrefersColorScheme(): Theme {
    if (Environment.isWindowNotDefined) {
      ModuleLogger.warn('Appearance', 'themeByPrefersColorScheme', `window is not defined.`)
      return 'light'
    }

    if (typeof window.matchMedia === 'undefined') {
      ModuleLogger.warn('Appearance', 'themeByPrefersColorScheme', `window.matchMedia is not defined.`)
      return 'light'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  get isThemeDark(): boolean {
    switch (this.theme) {
      case 'dark':
        return true
      case 'light':
        return false
      case 'system':
        return this.themeByPrefersColorScheme === 'dark'
      default:
        return false
    }
  }

  get isThemeLight(): boolean {
    switch (this.theme) {
      case 'dark':
        return false
      case 'light':
        return true
      case 'system':
        return this.themeByPrefersColorScheme === 'light'
      default:
        return false
    }
  }

  get isThemeSystem(): boolean {
    return this.theme === 'system'
  }
}
