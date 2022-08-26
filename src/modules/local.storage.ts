import { StorageItem } from '../definitions/interfaces'
import { Environment } from './environment'
import { Storage } from './storage'

/**
 * A module to handle local storage operations through a store.
 *
 * @category Module
 */
export const LocalStorage = new Storage(
  'LocalStorage',
  async () => (Environment.isWindowDefined ? localStorage.clear() : undefined),
  async (key: string) => (Environment.isWindowDefined ? JSON.parse(localStorage.getItem(key) || '{}') : {}),
  async (key: string) => (Environment.isWindowDefined ? localStorage.getItem(key) !== null : false),
  async (key: string) => (Environment.isWindowDefined ? localStorage.removeItem(key) : undefined),
  async (key: string, item: StorageItem) => (Environment.isWindowDefined ? localStorage.setItem(key, JSON.stringify(item)) : undefined)
)
