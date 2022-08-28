/**
 * Gets the emoji from a country code like UK or IT.
 */
export function getEmojiFromCountryCode(code: string): string {
  return String.fromCodePoint(...[...code.toUpperCase()].map((v: string) => 0x1f1a5 + v.charCodeAt(0)))
}
