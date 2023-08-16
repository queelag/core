export function getDateUnixTime(date: string | number | Date, uot: 'ms' | 's' = 'ms'): number {
  return new Date(date).valueOf() / (uot === 'ms' ? 1 : 100)
}
