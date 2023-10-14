export function isInstanceOf<I extends Function>(value: any, instance: I): value is I {
  return value instanceof instance
}

export function isNotInstanceOf<T, I extends Function>(value: T, instance: I): value is T {
  return !(value instanceof instance)
}
