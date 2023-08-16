export function isError<T>(value: T | Error): value is Error {
  return value instanceof Error
}

export function isNotError<T>(value: T | Error): value is T {
  return !(value instanceof Error)
}
