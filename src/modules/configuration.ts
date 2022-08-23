import { DEFAULT_CONFIGURATION_MODULE } from '../definitions/constants'
import { ConfigurationModule } from '../definitions/interfaces'

export class Configuration {
  static module: ConfigurationModule = DEFAULT_CONFIGURATION_MODULE()
}
