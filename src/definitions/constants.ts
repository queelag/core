import { noop } from '../functions/noop'
import { Environment } from '../modules/environment'
import { removeSearchParamsFromURL } from '../utils/url'
import { ConfigurationModule, CookieTarget } from './interfaces'
import { ArrayIncludes, ArrayRemoves, IsEqual, StatusTransformer } from './types'

export const ALPHABET_LOWERCASE: string = 'abcdefghijklmnopqrstuvwxyz'
export const ALPHABET_NO_LOOK_ALIKES_SAFE: string = '6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz'
export const ALPHABET_NO_LOOK_ALIKES: string = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'
export const ALPHABET_NUMBERS: string = '0123456789'
export const ALPHABET_UPPERCASE: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const ALPHABET_ALPHANUMERIC: string = ALPHABET_NUMBERS + ALPHABET_LOWERCASE + ALPHABET_UPPERCASE
export const ALPHABET_HEX_LOWERCASE: string = ALPHABET_NUMBERS + 'abcdef'
export const ALPHABET_HEX_UPPERCASE: string = ALPHABET_NUMBERS + 'ABCDEF'

export const DEFAULT_API_STATUS_TRANSFORMER: StatusTransformer = (keys: string[]) => {
  return keys[0] + '_' + removeSearchParamsFromURL(keys[1])
}

export const DEFAULT_ARRAY_INCLUDES: ArrayIncludes<any> = (array: any[], item: any) => array.includes(item)

export const DEFAULT_ARRAY_REMOVES: ArrayRemoves<any> = (array: any[], item: any) => array.includes(item)

export const DEFAULT_COOKIE_TARGET: () => CookieTarget = () => ({
  get: () => {
    if (Environment.isWindowNotDefined) {
      return ''
    }

    return document.cookie
  },
  set: (string: string) => {
    if (Environment.isWindowNotDefined) {
      return
    }

    document.cookie = string
  }
})

export const DEFAULT_CONFIGURATION_MODULE: () => ConfigurationModule = () => ({
  tc: {
    log: true,
    onCatch: noop
  },
  tcp: {
    log: true,
    onCatch: noop
  }
})

export const DEFAULT_HISTORY_SIZE: number = 100

export const DEFAULT_IS_EQUAL: IsEqual<any, any> = (a: any, b: any) => a === b

export const DEFAULT_STATUS_TRANSFORMER: StatusTransformer = (keys: string[]) => keys.join('_')

export const EMPTY_OBJECT: () => Record<PropertyKey, any> = () => ({})

export const STUB_TEXT_DECODER: TextDecoder = {
  decode: () => '',
  encoding: '',
  fatal: false,
  ignoreBOM: false
}

export const STUB_TEXT_ENCODER: TextEncoder = {
  encode: () => new Uint8Array(),
  encodeInto: () => ({ read: 0, written: 0 }),
  encoding: ''
}
