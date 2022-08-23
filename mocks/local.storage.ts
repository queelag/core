import { noop } from '../src'

const map = new Map()

global.window = global.window || {}
global.window.localStorage = {
  clear: () => map.clear(),
  getItem: (key: string) => map.get(key),
  key: noop,
  length: 0,
  removeItem: (key: string) => map.delete(key),
  setItem: (key: string, value: string) => map.set(key, value)
}
