export function tie<T, U extends Error = Error>(value: T | U): T {
  if (value instanceof Error) {
    throw value
  }

  return value
}
