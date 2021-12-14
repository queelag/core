import { Storage } from './storage'

/**
 * A module to handle local storage operations through a store.
 *
 * @category Module
 */
export const LocalStorage: Storage = new Storage(
  'LocalStorage',
  async (key: string) => JSON.parse(window.localStorage.getItem(key) || ''),
  async (key: string) => window.localStorage.removeItem(key),
  async (key: string, value: string) => window.localStorage.setItem(key, value)
)
