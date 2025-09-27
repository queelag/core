import { DEFAULT_APPEARENCE_STORAGE_KEY, DEFAULT_APPEARENCE_THEME } from '../definitions/constants.js'
import type { AppearenceEvents, AppearenceInit } from '../definitions/interfaces.js'
import type { Storage, Theme } from '../definitions/types.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { MemoryStorage } from '../storages/memory-storage.js'
import { isWindowNotDefined } from '../utils/environment-utils.js'
import { isNotError } from '../utils/error-utils.js'
import { EventEmitter } from './event-emitter.js'

/**
 * The Appearence class manages the theme of anything that can have an appearence.
 *
 * - The theme will persist to a storage of your choice, by default it will be stored in memory.
 * - The default theme is system, which means that the theme will be dark or light depending on the system theme.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/appearence)
 */
export class Appearence extends EventEmitter<AppearenceEvents> {
  /**
   * The storage that will be used to store the theme.
   */
  storage: Storage
  /**
   * The key that will be used to store the theme.
   */
  storageKey: string
  /**
   * The theme, can be dark, light or system.
   */
  theme: Theme

  constructor(init?: AppearenceInit) {
    super()

    this.storage = init?.storage?.instance ?? MemoryStorage
    this.storageKey = init?.storage?.key ?? DEFAULT_APPEARENCE_STORAGE_KEY
    this.theme = init?.theme ?? DEFAULT_APPEARENCE_THEME

    this.registerThemeEventListener()
  }

  /**
   * Retrieves the theme from the storage and sets it.
   */
  async initialize(): Promise<boolean> {
    let copied: void | Error

    copied = await this.storage.copy(this.storageKey, this, ['theme'])
    if (copied instanceof Error) return false

    this.setTheme(this.theme)

    return true
  }

  /**
   * Toggles the theme between dark and light.
   * If the theme is set to system, it will be set to dark or light depending on the system theme.
   */
  toggleTheme(): this {
    switch (this.theme) {
      case 'dark':
        return this.setTheme('light')
      case 'light':
        return this.setTheme('dark')
      case 'system':
        return this.setTheme(this.themeByPrefersColorScheme === 'dark' ? 'light' : 'dark')
      default:
        return this
    }
  }

  /**
   * Sets the theme.
   * The "change-theme" event will be emitted.
   */
  setTheme(theme: Theme): this {
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

    return this
  }

  /**
   * Stores the theme in the storage.
   */
  async store(): Promise<boolean> {
    return isNotError(await this.storage.set(this.storageKey, this, ['theme']))
  }

  /**
   * Registers the theme event listener in environments that support it.
   */
  protected registerThemeEventListener(): void {
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

  /**
   * Returns the theme depending on the system theme.
   */
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

  /**
   * Checks if the theme is dark.
   */
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

  /**
   * Checks if the theme is light.
   */
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

  /**
   * Checks if the theme is system.
   */
  get isThemeSystem(): boolean {
    return this.theme === 'system'
  }
}
