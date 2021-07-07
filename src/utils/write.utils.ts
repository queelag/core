import { WriteMode } from '../definitions/enums'
import { WithIdentity } from '../definitions/types'

export class WriteUtils {
  static findMode<T extends WithIdentity>(object: T): WriteMode {
    return object.id.length > 0 ? WriteMode.UPDATE : WriteMode.CREATE
  }

  static isModeCreate<T extends WithIdentity>(object: T): boolean {
    return this.findMode(object) === WriteMode.CREATE
  }

  static isModeWrite<T extends WithIdentity>(object: T): boolean {
    return this.findMode(object) === WriteMode.UPDATE
  }
}
