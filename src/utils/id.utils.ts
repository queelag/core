import { nanoid } from 'nanoid'
import { ID } from '../definitions/types'

/**
 * Utils for anything related to IDs.
 *
 * @category Utility
 */
export class IDUtils {
  /** @hidden */
  constructor() {}

  /**
   * Generates an ID with a prefix separating the two with an underscore.
   */
  static prefixed(prefix: string): string {
    return prefix + '_' + nanoid()
  }

  /**
   * Generates an unique ID excluding the IDs in the blacklist
   */
  static unique(blacklist: ID[] = []): string {
    let id: string

    while (true) {
      id = nanoid()
      if (!blacklist.includes(id)) break
    }

    return id
  }
}
