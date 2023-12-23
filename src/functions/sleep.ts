/**
 * The `sleep` function takes a number of milliseconds and returns a promise that resolves after that many milliseconds.
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(() => r(), ms))
}
