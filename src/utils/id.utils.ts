import { nanoid } from 'nanoid'

export class IDUtils {
  static prefixed(prefix: string): string {
    return prefix + '_' + nanoid()
  }

  static unique(exclude: string[] = []): string {
    let id: string

    while (true) {
      id = nanoid()
      if (!exclude.includes(id)) break
    }

    return id
  }
}
