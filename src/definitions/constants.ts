import { noop } from '@/functions/noop'
import { ConfigurationModule, HistoryData } from './interfaces'

export const ALPHABET_LOWERCASE: string = 'abcdefghijklmnopqrstuvwxyz'
export const ALPHABET_NO_LOOK_ALIKES_SAFE: string = '6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz'
export const ALPHABET_NO_LOOK_ALIKES: string = '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz'
export const ALPHABET_NUMBERS: string = '0123456789'
export const ALPHABET_UPPERCASE: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const ALPHABET_ALPHANUMERIC: string = ALPHABET_NUMBERS + ALPHABET_LOWERCASE + ALPHABET_UPPERCASE
export const ALPHABET_HEX_LOWERCASE: string = ALPHABET_NUMBERS + 'abcdef'
export const ALPHABET_HEX_UPPERCASE: string = ALPHABET_NUMBERS + 'ABCDEF'

export const DEFAULT_CONFIGURATION_MODULE: () => ConfigurationModule = () => ({
  tc: {
    onCatch: noop
  },
  tcp: {
    onCatch: noop
  }
})

export const DEFAULT_HISTORY_DATA: () => HistoryData<any, any> = () => ({
  index: 0,
  key: '',
  size: 0,
  target: {},
  versions: []
})

export const EMPTY_OBJECT: () => {} = () => ({})
