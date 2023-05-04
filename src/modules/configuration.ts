import { DEFAULT_CONFIGURATION_MODULE } from '../definitions/constants.js'
import { ConfigurationModule } from '../definitions/interfaces.js'

export class Configuration {
  static module: ConfigurationModule = DEFAULT_CONFIGURATION_MODULE()
}
