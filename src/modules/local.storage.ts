import { Environment } from './environment'
import { Storage } from './storage'

/**
 * A module to handle local storage operations through a store.
 *
 * @category Module
 */
export const LocalStorage = new Storage(
  'LocalStorage',
  async (key: string) => (Environment.isWindowDefined ? JSON.parse(window.localStorage.getItem(key) || '{}') : {}),
  async (key: string) => (Environment.isWindowDefined ? window.localStorage.removeItem(key) : undefined),
  async (key: string, value: string) => (Environment.isWindowDefined ? window.localStorage.setItem(key, value) : undefined)
)
