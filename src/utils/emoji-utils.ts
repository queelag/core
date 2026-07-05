/**
 * Returns the matching emoji flag from a country code.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/emoji)
 */
export function getEmojiFromCountryCode(code: string): string {
  // biome-ignore lint/style/noMagicNumbers: constant is not necessary
  // biome-ignore lint/style/useNumericSeparators: separator is not necessary
  return String.fromCodePoint(...[...code.toUpperCase()].map((v: string) => 0x1f1a5 + v.charCodeAt(0)))
}
