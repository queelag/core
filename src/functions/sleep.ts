/**
 * The `sleep` function takes a number of milliseconds and returns a promise that resolves after that many milliseconds.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/sleep)
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(() => r(), ms))
}
