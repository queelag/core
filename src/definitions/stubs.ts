export const STUB_STORAGE: (map: Map<string, string>) => Storage = (map: Map<string, string>) => ({
  clear: () => map.clear(),
  getItem: (key: string) => {
    let value: string | undefined

    value = map.get(key)
    if (typeof value === 'undefined') return null

    return value
  },
  key: (index: number) => {
    let key: string | undefined

    key = [...map.keys()][index]
    if (typeof key === 'undefined') return null

    return key
  },
  removeItem: (key: string) => {
    map.delete(key)
  },
  setItem: (key: string, value: string) => {
    map.set(key, value)
  },
  get length(): number {
    return map.size
  }
})

export const STUB_LOCAL_STORAGE_MAP: Map<string, string> = new Map()
export const STUB_LOCAL_STORAGE: Storage = STUB_STORAGE(STUB_LOCAL_STORAGE_MAP)

export const STUB_SESSION_STORAGE_MAP: Map<string, string> = new Map()
export const STUB_SESSION_STORAGE: Storage = STUB_STORAGE(STUB_SESSION_STORAGE_MAP)

export const STUB_TEXT_DECODER: TextDecoder = Object.freeze({
  decode: () => '',
  encoding: '',
  fatal: false,
  ignoreBOM: false
})

export const STUB_TEXT_ENCODER: TextEncoder = Object.freeze({
  encode: () => new Uint8Array(),
  encodeInto: () => ({ read: 0, written: 0 }),
  encoding: ''
})
