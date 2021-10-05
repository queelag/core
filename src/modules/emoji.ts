export class Emoji {
  static fromCountryCode(code: string): string {
    return String.fromCodePoint(...[...code.toUpperCase()].map((v: string) => 0x1f1a5 + v.charCodeAt(0)))
  }
}
