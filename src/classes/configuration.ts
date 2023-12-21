import { DEFAULT_FUNCTIONS_CONFIGURATION } from '../definitions/constants.js'
import { ConfigurationFunctions } from '../definitions/interfaces.js'

/**
 * The Configuration class is used to configure the library.
 */
export class Configuration {
  /**
   * The functions configuration.
   */
  static functions: ConfigurationFunctions = DEFAULT_FUNCTIONS_CONFIGURATION()
}
