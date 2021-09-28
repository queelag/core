import { Storage } from './storage'

/**
 * A module to handle session storage operations through a store.
 *
 * @category Module
 */
export const SessionStorage: Storage = new Storage(
  'SessionStorage',
  async (key: string) => window.sessionStorage.getItem(key),
  async (key: string) => window.sessionStorage.removeItem(key),
  async (key: string, value: string) => window.sessionStorage.setItem(key, value)
)
