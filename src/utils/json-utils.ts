import { tc } from '../functions/tc.js'

export function parseBigIntJSON<T extends object>(text: string): T {
  return JSON.parse(text, (_, value: any) => {
    switch (typeof value) {
      case 'number': {
        let bigint: bigint | Error

        if (Number.isSafeInteger(value)) {
          return value
        }

        bigint = tc(() => BigInt(value), false)
        if (bigint instanceof Error) return value

        return bigint
      }
      default:
        return value
    }
  })
}
