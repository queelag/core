export class Sleep {
  static async for(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(() => r(), ms))
  }
}
