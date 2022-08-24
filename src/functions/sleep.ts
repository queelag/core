/**
 * Sleeps for ms time.
 *
 * @returns
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(() => r(), ms))
}