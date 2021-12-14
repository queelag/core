export class ErrorUtils {
  static is<T>(value: T | Error): value is Error {
    return value instanceof Error
  }

  static isNot<T>(value: T | Error): value is T {
    return !(value instanceof Error)
  }
}
