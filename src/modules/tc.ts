export function tc<T, U extends Error = Error>(f: () => T, v: boolean = true): T | U {
  try {
    return f()
  } catch (e: any) {
    v && console.error(e)
    return e
  }
}
