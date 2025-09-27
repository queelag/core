import type { DecodeJsonOptions, EncodeJsonOptions } from '../definitions/interfaces.js'
import { tc } from '../functions/tc.js'
import { isStringBigInt, isStringFloat, isStringInt } from './string-utils.js'

function decodeJsonReviver(options: DecodeJsonOptions | undefined) {
  return (_: string, value: any): any => {
    switch (typeof value) {
      case 'number': {
        if (options?.castUnsafeIntToBigInt && !Number.isSafeInteger(value)) {
          let bigint: bigint | Error

          bigint = tc(() => BigInt(value), false)
          if (bigint instanceof Error) return value

          return bigint
        }

        return value
      }
      case 'string': {
        let bigint: bigint | Error

        if (options?.castFloatStringToNumber && isStringFloat(value)) {
          return parseFloat(value)
        }

        if (options?.castBigIntStringToBigInt && isStringBigInt(value)) {
          bigint = tc(() => BigInt(value), false)
          if (bigint instanceof Error) return value

          return bigint
        }

        if (options?.castIntStringToNumber && isStringInt(value)) {
          return parseInt(value)
        }

        return value
      }
      default:
        return value
    }
  }
}

export function decodeJSON<T extends object>(text: string, options?: DecodeJsonOptions): T | Error
export function decodeJSON<T extends object>(text: string, options: DecodeJsonOptions | undefined, fallback: T): T
export function decodeJSON<T extends object>(text: string, options?: DecodeJsonOptions, fallback?: T): T | Error {
  let json: T | Error

  json = tc(() => JSON.parse(text, decodeJsonReviver(options)))
  if (json instanceof Error) return fallback ?? json

  return json
}

function encodeJsonReplacer(options: EncodeJsonOptions | undefined) {
  return (_: string, value: any): any => {
    if (options?.castBigIntToString && typeof value === 'bigint') {
      return value.toString()
    }

    return value
  }
}

export function encodeJSON(value: unknown, options?: EncodeJsonOptions): string | Error
export function encodeJSON(value: unknown, options: EncodeJsonOptions | undefined, fallback: string): string
export function encodeJSON(value: unknown, options?: EncodeJsonOptions, fallback?: string): string | Error {
  let string: string | Error

  string = tc(() => JSON.stringify(value, encodeJsonReplacer(options)))
  if (string instanceof Error) return fallback ?? string

  return string
}
