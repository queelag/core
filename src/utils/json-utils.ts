export function parseBigIntJSON<T extends object>(text: string): T {
  return JSON.parse(text, (_, value: any) => {
    switch (typeof value) {
      case 'number':
        return Number.isSafeInteger(value) ? value : BigInt(value)
      default:
        return value
    }
  })
}
