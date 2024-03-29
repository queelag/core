/**
 * Returns the matching emoji flag from a country code.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/emoji)
 */
export function getEmojiFromCountryCode(code: string): string {
  return String.fromCodePoint(...[...code.toUpperCase()].map((v: string) => 0x1f1a5 + v.charCodeAt(0)))
}
