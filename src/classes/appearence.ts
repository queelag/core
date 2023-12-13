import { DEFAULT_APPEARENCE_STORAGE_KEY } from '../definitions/constants.js'
import { AppearenceEvents } from '../definitions/interfaces.js'
import { Storage, Theme } from '../definitions/types.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { MemoryStorage } from '../storages/memory-storage.js'
import { isWindowNotDefined } from '../utils/environment-utils.js'
import { isNotError } from '../utils/error-utils.js'
import { EventEmitter } from './event-emitter.js'

export class Appearence extends EventEmitter<AppearenceEvents> {
  storage: Storage
  storageKey: string
  theme: Theme

  constructor(theme: Theme = 'system', storage: Storage = MemoryStorage, storageKey: string = DEFAULT_APPEARENCE_STORAGE_KEY) {
    super()

    this.storage = storage
    this.storageKey = storageKey
    this.theme = theme

    this.registerThemeEventListener()
  }

  async initialize(): Promise<boolean> {
    let copied: void | Error

    copied = await this.storage.copy(this.storageKey, this, ['theme'])
    if (copied instanceof Error) return false

    this.setTheme(this.theme)

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
    ClassLogger.verbose('Appearence', 'setTheme', `The theme has been set to ${theme}.`)

    switch (theme) {
      case 'dark':
      case 'light':
        this.emit('change-theme', theme)
        break
      case 'system':
        this.emit('change-theme', this.themeByPrefersColorScheme)
        break
      default:
        this.emit('change-theme', theme)
        break
    }
  }

  async store(): Promise<boolean> {
    return isNotError(await this.storage.set(this.storageKey, this, ['theme']))
  }

  private registerThemeEventListener(): void {
    let media: MediaQueryList

    if (isWindowNotDefined()) {
      return ClassLogger.warn('Appearence', 'registerThemeEventListener', `The window is not defined.`)
    }

    if (typeof window.matchMedia === 'undefined') {
      return ClassLogger.warn('Appearence', 'registerThemeEventListener', `The window.matchMedia function is not defined.`)
    }

    media = window.matchMedia('(prefers-color-scheme: dark)')
    if (typeof media.addEventListener !== 'function')
      return ClassLogger.warn('Appearence', 'registerThemeEventListener', `The window.matchMedia.addEventListener function is not defined.`)

    media.addEventListener('change', (v: MediaQueryListEvent) => this.isThemeSystem && this.setTheme('system'))
  }

  get themeByPrefersColorScheme(): Theme {
    if (isWindowNotDefined()) {
      ClassLogger.warn('Appearence', 'themeByPrefersColorScheme', `window is not defined.`)
      return 'light'
    }

    if (typeof window.matchMedia === 'undefined') {
      ClassLogger.warn('Appearence', 'themeByPrefersColorScheme', `window.matchMedia is not defined.`)
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
