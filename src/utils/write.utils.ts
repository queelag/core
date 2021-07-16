import { WriteMode } from '../definitions/enums'
import { WithIdentity } from '../definitions/types'

/**
 * Utils for anything related to writing identifiable objects.
 *
 * @category Utility
 */
export class WriteUtils {
  /** @hidden */
  constructor() {}

  /**
   * Finds the {@link WriteMode} for an identifiable object.
   *
   * @template T The object interface which extends {@link WithIdentity}
   */
  static findMode<T extends WithIdentity>(object: T): WriteMode {
    return object.id.length > 0 ? WriteMode.UPDATE : WriteMode.CREATE
  }

  /**
   * Checks if the mode of an identifiable object is CREATE.
   *
   * @template T The object interface which extends {@link WithIdentity}
   */
  static isModeCreate<T extends WithIdentity>(object: T): boolean {
    return this.findMode(object) === WriteMode.CREATE
  }

  /**
   * Checks if the mode of an identifiable object is UPDATE.
   *
   * @template T The object interface which extends {@link WithIdentity}
   */
  static isModeWrite<T extends WithIdentity>(object: T): boolean {
    return this.findMode(object) === WriteMode.UPDATE
  }
}
