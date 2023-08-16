export function isInstanceOf<T extends Function>(value: any, instance: T): value is T {
  return value instanceof instance
}
