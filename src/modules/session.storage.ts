import { Environment } from './environment'
import { Storage } from './storage'

/**
 * A module to handle session storage operations through a store.
 *
 * @category Module
 */
export const SessionStorage = new Storage(
  'SessionStorage',
  async (key: string) => (Environment.isWindowDefined ? JSON.parse(window.sessionStorage.getItem(key) || '{}') : {}),
  async (key: string) => (Environment.isWindowDefined ? window.sessionStorage.removeItem(key) : undefined),
  async (key: string, value: string) => (Environment.isWindowDefined ? window.sessionStorage.setItem(key, value) : undefined)
)
