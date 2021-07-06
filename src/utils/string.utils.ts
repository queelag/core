export class StringUtils {
  static capitalize(value: string, lowercase: boolean = false): string {
    return value.charAt(0).toUpperCase() + (lowercase ? value.slice(1).toLowerCase() : value.slice(1))
  }

  static concat(...strings: string[]): string {
    return strings.join('_')
  }
}
