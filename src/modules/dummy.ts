import { ConfigurationData } from '../definitions/interfaces'
import { noop } from './noop'

export class Dummy {
  static get configurationData(): ConfigurationData {
    return {
      module: {
        tc: {
          onCatch: noop
        },
        tcp: {
          onCatch: noop
        }
      }
    }
  }
}
