/**
 * Utils for anything related to dates.
 *
 * @category Utility
 */
export class DateUtils {
  /** @hidden */
  constructor() {}

  /**
   * Converts any parsable value by Date to milliseconds.
   */
  static toMilliseconds(value: any): number {
    return new Date(value).valueOf()
  }
}
