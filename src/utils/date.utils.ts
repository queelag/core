/**
 * Utils for anything related to dates.
 *
 * @category Utility
 */
export class DateUtils {
  /** @hidden */
  constructor() {}

  /**
   * Converts any parsable value by Date to milliseconds
   *
   * @param value Any parsable value by Date
   * @returns The date in milliseconds
   */
  static toMilliseconds(value: any): number {
    return new Date(value).valueOf()
  }
}
