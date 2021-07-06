export class DateUtils {
  static toMilliseconds(value: any): number {
    return new Date(value).valueOf()
  }
}
