/**
 * Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
 */
export function getDateInMilliseconds(date: string | number | Date): number {
  return new Date(date).valueOf()
}

/**
 * @deprecated
 */
export class DateUtils {
  static toMilliseconds = getDateInMilliseconds
}
